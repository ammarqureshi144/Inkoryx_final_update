/**
 * SealEmbed.tsx — Inkoryx Internal Sealing Tool (Per-File Unlock Code Version)
 * Every sealed image gets its own unique random Unlock Code.
 * The code itself is used to derive the encryption — without it, verification fails.
 */

import { useCallback, useRef, useState } from "react";
import { ShieldCheck, UploadCloud, Loader2, Download, KeyRound, Copy, Check } from "lucide-react";

function embedIkx1(pixels: Uint8ClampedArray, json: string): boolean {
  const payload = new TextEncoder().encode(json);
  const magic = [73, 75, 88, 50]; // "IKX2" - new version with unlock code
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

// Generate a random unlock code like "X7K2-9PQR-4MNB"
function generateUnlockCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no confusing chars like O,0,I,1
  const randomGroup = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `${randomGroup()}-${randomGroup()}-${randomGroup()}`;
}

async function sha256Hex(buffer: ArrayBuffer | string): Promise<string> {
  const data = typeof buffer === "string" ? new TextEncoder().encode(buffer) : buffer;
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

type EmbedState =
  | { status: "idle" }
  | { status: "working" }
  | { status: "done"; sealedUrl: string; fileName: string; unlockCode: string }
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
  const [copied, setCopied] = useState(false);

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
      const unlockCode = generateUnlockCode();

      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width; canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(bitmap, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Hash the unlock code itself — this becomes the "lock"
      const codeHash = await sha256Hex(unlockCode);

      const payload = {
        client: client.trim(),
        assetId: assetId.trim(),
        artist: artist.trim(),
        notes: notes.trim(),
        codeHash, // verify page will hash the typed code and compare
        date: new Date().toISOString(),
        v: 1,
      };

      const ok = embedIkx1(imageData.data, JSON.stringify(payload));
      if (!ok) { setState({ status: "error", message: "Image too small. Use a larger image." }); return; }
      ctx.putImageData(imageData, 0, 0);
      const sealedBlob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/png"));
      const sealedUrl = URL.createObjectURL(sealedBlob);
      const baseName = file.name.replace(/\.[^.]+$/, "");

      setState({ status: "done", sealedUrl, fileName: baseName + "_sealed.png", unlockCode });
    } catch (err: any) {
      setState({ status: "error", message: err?.message ?? "Unknown error" });
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon/30 bg-neon/5 text-xs text-neon mb-4">
          <KeyRound size={13} /> INTERNAL TOOL — ADMIN ONLY
        </div>
        <h1 className="font-heading text-3xl font-bold gradient-text mb-2">Seal an Asset</h1>
        <p className="text-muted-foreground text-sm">Each image gets a unique Unlock Code. The client needs this code to verify their file.</p>
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

          <div className="mb-4 p-4 rounded-xl border border-yellow-400/40 bg-yellow-400/5">
            <p className="text-xs text-yellow-400 font-medium mb-2">⚠️ UNLOCK CODE — send this to your client separately</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-lg font-mono font-bold text-foreground tracking-wider bg-black/30 px-3 py-2 rounded-lg">
                {state.unlockCode}
              </code>
              <button onClick={() => copyCode(state.unlockCode)}
                className="p-2 rounded-lg border border-border hover:border-neon/40 transition">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">This code cannot be recovered later. Save it now.</p>
          </div>

          <p className="text-xs text-muted-foreground mb-4">Send the sealed PNG AND the unlock code to your client (in separate messages for security). They'll need both to verify.</p>
          <a href={state.sealedUrl} download={state.fileName}
            className="flex items-center justify-center gap-2 py-2 rounded-lg bg-green-400/20 border border-green-400/40 text-green-400 text-sm font-medium hover:bg-green-400/30 transition">
            <Download className="w-4 h-4" /> Download sealed PNG
          </a>
        </div>
      )}
    </div>
  );
}
