

import { useCallback, useRef, useState } from "react";
import { ShieldCheck, UploadCloud, Loader2, Download, KeyRound } from "lucide-react";

// ─── PERMANENT INKORYX PRIVATE KEY (never share this) ────────────────────────
const INKORYX_PRIVATE_KEY_B64 = "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC617zmACJ7LZgIy2aM0Zb1upAMfkifW3DM2RM395539KN+/FVUXmUITbFZG0vsjqel9gx1/WJTP5dSunoIKVQtRXPigKpgo+ugHfTCVEa2tS4v6ZuV4EYejTZ/iNuqRpTTWeVVix6zLUQv9v6hINlOL+lsp5Rd0vZNZY2MMIPPK4SAxhPzq4j2BnkgRk05M3r/ICVAcZwgUZMjBUTXluxzHkMQb7xDjsebaHks5l4AdIQMtGr5wELj1ikr6al6YuYANcq/lcvr4362N6S/QxaSr2HxVHVlHy/r29u9jIisRCfXAf6U5lPY3K3Q9AcJqIS5VpuMYEwmJrzdZ4PMvworAgMBAAECggEAOzlmJYuWYnAV2HfMxkcrMDHWNjeTQnwEGdKXDm79eq1/Y6GNVKRlJwgldoa5/r5LMsZ2tbG/CH9IMo9sXgjnpz/0FzBMkTx0VDkam7yF+6UbglFsoUnJQCbnxu41HtinlQTSNlbWQNpQ2llS5fUZHHkAZxIJa+ISc38EqpK4PSLWAkKNo047IVhTTJON30FIQS+wjRip3a1h0+dmwoIbSKzKRGlUNofd0HQmtdEWzXzYq2rDhFb91PJQVsJbb3GRH8skAMUD1C5JjBQzFkMx3SdxQB0X4T5bulgNF1GUCWBffP/VrrHKh+G95ZC9bvuXPGWhhu1Rz3jKiiB/FHEYBQKBgQDcmoWzrNJMt7orDMeT0orbWzGC2Fk0c6+W09Ne4fwJMaSJGwsIVAsLUQ9V8BR/ZwP37TWwDbWtx3KeCbdgu5fH5NYfeAqhAOuJOwAkV35sKijZK3PE+blV2mZaNYdgMTDJnJLhyZ0UqBHpmGHzcOa90EUoQM+BnejD801t19wH3wKBgQDY0nWW+dKkokWqxIwIvDZBmEM5tBwKdLyo1VUMei6GR0j5zCO+pwvALkBUIYtg1QC/YpWb/sXVlNxMAY/JFvefaW7Xd1I56Ca5L0IvFXA2PmNYk1KpgH+tBH3JwRG3qrTpM2MhxCa1L1jL25IIjvDpSWOyl/Q7WWl0jMbCM4+3NQKBgCc35Vsa90wiQZuTqwtxm7QBk1zCn6E+i9HRmLs+i7MKu0iQoTZ60nfRklth0hMQOlliN3A0D790PMEx0wMEdqhX22U+zwzuf/EmpxDO6S/LkvWAzxUOnE9SA244I/gK5rSA/G/diup4Mq8HoypHQQ4vr4vHcdyGOTJU18gWXwybAoGBAKWci2jYRUavE9uN6RA7Ao4zyRVoNwrdg8TJvf6bzLGP/XOfs6XKXjVanpQkUxuRVtLYcEII5f9vhp0fjD4ipt1CYQF/CHVmlz1XlYv1KhKksKlVTgxeNCdpiNLz/550a168e3mtI4u9MGv1uKOE2wq1ncsqOcijUONPK/nl/F4JAoGAMvUaj8qzHawFDJixwkK5AUDruc4LqxmLl0dy0SpJSij5ERf6myu7hzbTylfwV2I4FzqBPt5HFkXFrVD52gAZUrZ5t0363vUHrgYfpMFpLZDjtTciBop6B1SLam2PupIO1UFccJZjSU9NWvWOcygtzGcqmEJLlhOhrjCRRSvjqTU=";
// ─────────────────────────────────────────────────────────────────────────────

function embedIkx1(pixels: Uint8ClampedArray, json: string): boolean {
  const payload = new TextEncoder().encode(json);
  const magic = [73, 75, 88, 49]; // "IKX1"
  const len = payload.length;
  const lenBytes = [(len >>> 24) & 0xff, (len >>> 16) & 0xff, (len >>> 8) & 0xff, len & 0xff];
  const allBytes = new Uint8Array([...magic, ...lenBytes, ...payload]);
  let usable = 0;
  for (let i = 0; i < pixels.length; i++) { if (i % 4 !== 3) usable++; }
  if (allBytes.length * 8 > usable) return false;
  let byteIdx = 0;
  let bitInByte = 7;
  for (let i = 0; i < pixels.length && byteIdx < allBytes.length; i++) {
    if (i % 4 === 3) continue;
    const bit = (allBytes[byteIdx] >> bitInByte) & 1;
    pixels[i] = (pixels[i] & 0xfe) | bit;
    if (--bitInByte < 0) { bitInByte = 7; byteIdx++; }
  }
  return true;
}

async function getPrivateKey(): Promise<CryptoKey> {
  const binary = atob(INKORYX_PRIVATE_KEY_B64);
  const buffer = Uint8Array.from(binary, (c) => c.charCodeAt(0)).buffer;
  return crypto.subtle.importKey(
    "pkcs8", buffer,
    { name: "RSA-PSS", hash: "SHA-256" },
    false, ["sign"]
  );
}

async function sha256Hex(buffer: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function signHash(privateKey: CryptoKey, hashHex: string): Promise<string> {
  const data = new TextEncoder().encode(hashHex);
  const sig = await crypto.subtle.sign({ name: "RSA-PSS", saltLength: 32 }, privateKey, data);
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

type EmbedState =
  | { status: "idle" }
  | { status: "working" }
  | { status: "done"; sealedUrl: string; fileName: string; payload: object }
  | { status: "error"; message: string };

export function SealEmbed() {
  const [state, setState] = useState<EmbedState>({ status: "idle" });
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [client, setClient] = useState("");
  const [assetId, setAssetId] = useState("");
  const [artist, setArtist] = useState("Inkoryx Studio");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dims, setDims] = useState("");

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) { setState({ status: "error", message: "Please upload a PNG image." }); return; }
    setFile(f);
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => { setPreview(url); setDims(img.width + " × " + img.height + " px"); };
    img.src = url;
    setState({ status: "idle" });
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files?.[0]; if (f) handleFile(f);
  };

  const embedAndSeal = async () => {
    if (!file || !client.trim() || !assetId.trim()) return;
    setState({ status: "working" });
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width; canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(bitmap, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const rawBuffer = await new Promise<ArrayBuffer>((res) => canvas.toBlob((b) => b!.arrayBuffer().then(res), "image/png"));
      const hash = await sha256Hex(rawBuffer);
      const privateKey = await getPrivateKey();
      const signature = await signHash(privateKey, hash);
      const payload = {
        client: client.trim(), assetId: assetId.trim(),
        artist: artist.trim(), notes: notes.trim(),
        hash, signature, date: new Date().toISOString(), v: 2,
      };
      const ok = embedIkx1(imageData.data, JSON.stringify(payload));
      if (!ok) { setState({ status: "error", message: "Image too small. Use a larger image." }); return; }
      ctx.putImageData(imageData, 0, 0);
      const sealedBlob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/png"));
      const sealedUrl = URL.createObjectURL(sealedBlob);
      const baseName = file.name.replace(/\.[^.]+$/, "");
      setState({ status: "done", sealedUrl, fileName: baseName + "_sealed.png", payload });
    } catch (err: any) {
      setState({ status: "error", message: err?.message ?? "Unknown error" });
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon/30 bg-neon/5 text-xs text-neon mb-4">
          <KeyRound size={13} /> INTERNAL TOOL — ADMIN ONLY
        </div>
        <h1 className="font-heading text-3xl font-bold gradient-text mb-2">Seal an Asset</h1>
        <p className="text-muted-foreground text-sm">Embed a cryptographic ownership seal into the image before delivering to the client.</p>
      </div>

      <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
        onDrop={onDrop} onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-8 text-center glass mb-6 ${dragOver ? "border-neon shadow-[0_0_40px_rgba(56,189,248,0.3)]" : "border-neon/30 hover:border-neon/60"}`}>
        <input ref={inputRef} type="file" accept="image/png,image/bmp,image/webp" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        {preview ? (
          <div className="flex items-center gap-4 justify-center">
            <img src={preview} alt="preview" className="w-16 h-16 object-cover rounded-lg border border-border" />
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">{file?.name}</p>
              <p className="text-xs text-muted-foreground">{dims}</p>
              <p className="text-xs text-neon mt-1">Click to change</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <UploadCloud className="w-8 h-8 text-neon" />
            <p className="text-sm text-muted-foreground"><span className="text-foreground font-medium">Click to upload</span> or drag & drop</p>
            <p className="text-xs text-muted-foreground">PNG recommended — JPEG will destroy the seal</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Client name *</label>
          <input className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:border-neon/60"
            placeholder="e.g. Alex Johnson" value={client} onChange={(e) => setClient(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Asset ID *</label>
          <input className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:border-neon/60"
            placeholder="e.g. INK-2025-0042" value={assetId} onChange={(e) => setAssetId(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Artist / Studio</label>
          <input className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:border-neon/60"
            value={artist} onChange={(e) => setArtist(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Notes</label>
          <input className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:border-neon/60"
            placeholder="e.g. Commercial license" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      </div>

      <button disabled={!file || !client.trim() || !assetId.trim() || state.status === "working"} onClick={embedAndSeal}
        className="w-full py-3 rounded-xl bg-neon text-black font-heading font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neon/90 transition flex items-center justify-center gap-2">
        {state.status === "working" ? <><Loader2 className="w-4 h-4 animate-spin" /> Embedding seal…</> : <><ShieldCheck className="w-4 h-4" /> Embed Seal & Download</>}
      </button>

      {state.status === "error" && <p className="mt-4 text-sm text-red-400 text-center">{state.message}</p>}

      {state.status === "done" && (
        <div className="mt-6 rounded-2xl border border-green-400/40 bg-green-400/5 p-6">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-6 h-6 text-green-400" />
            <h3 className="font-heading font-bold text-green-400">Seal embedded successfully</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Send this sealed PNG directly to your client. Do NOT re-export or compress it.</p>
          <a href={state.sealedUrl} download={state.fileName}
            className="flex items-center justify-center gap-2 py-2 rounded-lg bg-green-400/20 border border-green-400/40 text-green-400 text-sm font-medium hover:bg-green-400/30 transition">
            <Download className="w-4 h-4" /> Download sealed PNG
          </a>
        </div>
      )}
    </div>
  );
}
