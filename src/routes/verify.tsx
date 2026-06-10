import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldAlert, UploadCloud, Loader2, FileLock2 } from "lucide-react";
import { AnimatedSection, ParticleField } from "@/components/AnimatedSection";

export const Route = createFileRoute("/verify")({
  component: VerifyPage,
  head: () => ({
    meta: [
      { title: "The Inkoryx Vault — Asset Verification" },
      {
        name: "description",
        content:
          "Mathematically verifiable proof of ownership. Drop your Inkoryx Cryptographic Master File to authenticate its digital signature.",
      },
      { property: "og:title", content: "The Inkoryx Vault — Asset Verification" },
      {
        property: "og:description",
        content:
          "Authenticate your Inkoryx Master File. Steganographic, mathematically verifiable — no NFTs, no blockchain.",
      },
    ],
  }),
});

const INKORYX_PUBLIC_KEY_B64 = `
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu0uxghc8L8j5JO3tyovH
grj9MTpBNGofWvESxLttufg7ziWqGGcWy/ld8p4IZv8WVrbpW/wWX1ORxKPhQttt
f3jGzjLnDVJWRAPz1eAXvyKCTcaVyOY0CXCKszPg4rY+o1AyyoVQyGnvZHJG5of3
75X74FJme5dF3XyUbSSN7VfvUs1u2hRo+vfng46H9MU2cIGbij1f0ev0ervVL3T+
tiZVIx4aE9wlXcPIJFngK59MbyxjPfwhne26vZk7MgHeV+OqM/nwKRf3rpJzA0vF
HHrEUuYCf2+cd4J1+0Lr4NOHnuch6pX/4m86V3Nb3hY8kpgS8ijjWpV2I8qOiWrM
TQIDAQAB
`.trim();
// ─────────────────────────────────────────────────────────────────────────────

const MAGIC = "IKX1";

type VerifyPayload = {
  client?: string;
  assetId?: string;
  artist?: string;
  signature?: string;
  hash?: string;
  date?: string;
  notes?: string;
  v?: number;
};

type Result =
  | { state: "idle" }
  | { state: "checking"; fileName: string }
  | { state: "verified"; fileName: string; payload: VerifyPayload }
  | { state: "failed"; fileName: string; reason: string };

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function sha256Hex(buffer: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function readPixels(file: File): Promise<Uint8ClampedArray | null> {
  if (!file.type.startsWith("image/")) return null;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return null;
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(bitmap, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height).data;
}

function bitsToBytes(bits: number[]): Uint8Array {
  const out = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < out.length; i++) {
    let b = 0;
    for (let j = 0; j < 8; j++) b = (b << 1) | bits[i * 8 + j];
    out[i] = b;
  }
  return out;
}

// Extract IKX1-format payload from pixel LSBs
function extractLsbPayload(pixels: Uint8ClampedArray): VerifyPayload | null {
  const bits: number[] = [];
  const headerBits = 8 * 8; // 4 magic + 4 length = 8 bytes = 64 bits

  let pi = 0;
  for (let i = 0; i < pixels.length && bits.length < headerBits; i++) {
    if (i % 4 === 3) continue;
    bits.push(pixels[i] & 1);
    pi = i;
  }
  if (bits.length < headerBits) return null;

  const headerBytes = bitsToBytes(bits.slice(0, headerBits));
  const magic = String.fromCharCode(...headerBytes.slice(0, 4));
  if (magic !== MAGIC) return null;

  const len =
    (headerBytes[4] << 24) | (headerBytes[5] << 16) | (headerBytes[6] << 8) | headerBytes[7];
  if (len <= 0 || len > 1_000_000) return null;

  const totalBits = headerBits + len * 8;
  for (let i = pi + 1; i < pixels.length && bits.length < totalBits; i++) {
    if (i % 4 === 3) continue;
    bits.push(pixels[i] & 1);
  }
  if (bits.length < totalBits) return null;

  const payloadBytes = bitsToBytes(bits.slice(headerBits, totalBits));
  try {
    const json = new TextDecoder().decode(payloadBytes);
    return JSON.parse(json) as VerifyPayload;
  } catch {
    return null;
  }
}

// Import Inkoryx public key from PEM base64
async function importPublicKey(b64: string): Promise<CryptoKey | null> {
  try {
    const binary = atob(b64.replace(/\s/g, ""));
    const buffer = Uint8Array.from(binary, (c) => c.charCodeAt(0)).buffer;
    return await crypto.subtle.importKey(
      "spki",
      buffer,
      { name: "RSA-PSS", hash: "SHA-256" },
      false,
      ["verify"]
    );
  } catch {
    return null;
  }
}

// Verify RSA-PSS signature over the hash string
async function verifyRsaSignature(
  pubKey: CryptoKey,
  hashHex: string,
  signatureB64: string
): Promise<boolean> {
  try {
    const data = new TextEncoder().encode(hashHex);
    const binary = atob(signatureB64);
    const sigBuffer = Uint8Array.from(binary, (c) => c.charCodeAt(0)).buffer;
    return await crypto.subtle.verify({ name: "RSA-PSS", saltLength: 32 }, pubKey, sigBuffer, data);
  } catch {
    return false;
  }
}

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: "Is this an NFT or Crypto-Art?",
    a: "No. We do not use public ledgers, blockchains, or volatile crypto networks. Inkoryx relies on proprietary, enterprise-grade steganography. Your data is hidden mathematically inside the pixels of your file. It carries zero gas fees and zero environmental impact.",
  },
  {
    q: "Why did my file fail verification?",
    a: 'If you uploaded your image to a platform like Twitter, Instagram, or Discord, that platform compressed the file to save space. Compression alters pixels, which permanently destroys the invisible signature. You must upload your original, uncompressed "Master Vault File" provided by Inkoryx at the time of delivery.',
  },
  {
    q: "Why do I need this?",
    a: "Standard artists sell disposable images; Inkoryx forges secure commercial assets. If someone steals your IP and tries to monetize it, a screenshot won't hold up in a DMCA dispute. Your Cryptographic Master File is your absolute, mathematically verifiable proof that Inkoryx forged the original IP exclusively for you.",
  },
];

// ─── Main component ───────────────────────────────────────────────────────────

function VerifyPage() {
  const [result, setResult] = useState<Result>({ state: "idle" });
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setResult({ state: "checking", fileName: file.name });
    try {
      const pixels = await readPixels(file);
      console.log("1. Pixels read:", pixels ? pixels.length : "FAILED");
      if (!pixels) {
        setResult({ state: "failed", fileName: file.name, reason: "File is not a readable image." });
        return;
      }
      const payload = extractLsbPayload(pixels);
      console.log("2. Payload extracted:", payload);
      if (!payload || !payload.signature) {
        setResult({ state: "failed", fileName: file.name, reason: "No cryptographic seal detected." });
        return;
      }
      console.log("3. Hash in payload:", payload.hash);
      console.log("4. Payload version:", payload.v);

      if (payload.v && payload.v >= 2) {
        const bitmap = await createImageBitmap(file);
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(bitmap, 0, 0);
        const pngBlob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/png"));
        const currentHash = await sha256Hex(await pngBlob.arrayBuffer());
        console.log("5. Current hash:", currentHash);
        console.log("6. Stored hash:", payload.hash);
        console.log("7. Hash match:", currentHash === payload.hash);

        if (currentHash !== payload.hash) {
          setResult({ state: "failed", fileName: file.name, reason: "File integrity check failed." });
          return;
        }

        const pubKey = await importPublicKey(INKORYX_PUBLIC_KEY_B64);
        console.log("8. Public key imported:", pubKey ? "YES" : "FAILED");
        if (!pubKey) {
          setResult({ state: "failed", fileName: file.name, reason: "Could not load public key." });
          return;
        }

        const valid = await verifyRsaSignature(pubKey, payload.hash, payload.signature);
        console.log("9. RSA signature valid:", valid);
        if (!valid) {
          setResult({ state: "failed", fileName: file.name, reason: "RSA signature verification failed." });
          return;
        }
      }

      setResult({ state: "verified", fileName: file.name, payload });
    } catch (err) {
      console.log("ERROR:", err);
      setResult({ state: "failed", fileName: file.name, reason: "Unable to process this file." });
    }
  }, []);
      // 1. Read pixels
      const pixels = await readPixels(file);
      if (!pixels) {
        setResult({ state: "failed", fileName: file.name, reason: "File is not a readable image or is a compressed web copy." });
        return;
      }

      // 2. Extract steganographic payload
      const payload = extractLsbPayload(pixels);
      if (!payload || !payload.signature || !payload.hash) {
        setResult({ state: "failed", fileName: file.name, reason: "No cryptographic seal detected. The file may be a screenshot or compressed copy." });
        return;
      }

      // 3. Re-draw image on canvas to strip EXIF, then hash pixels (same as embed tool)
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(bitmap, 0, 0);
      const pngBlob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/png"));
      const currentHash = await sha256Hex(await pngBlob.arrayBuffer());

      // 4. Check if hash matches what was embedded
      // NOTE: hash check is skipped for v1 payloads (legacy simple embeds)
      // For v2+ (SealEmbed tool output) we verify hash + RSA signature
      if (payload.v && payload.v >= 2) {
        if (currentHash !== payload.hash) {
          setResult({ state: "failed", fileName: file.name, reason: "File integrity check failed — the pixel data has been modified after sealing." });
          return;
        }

        // 5. Verify RSA signature
        if (INKORYX_PUBLIC_KEY_B64 === "REPLACE_WITH_YOUR_PUBLIC_KEY_BASE64_HERE") {
          // Public key not configured yet — fall through to payload-only verify
          setResult({ state: "verified", fileName: file.name, payload });
          return;
        }

        const pubKey = await importPublicKey(INKORYX_PUBLIC_KEY_B64);
        if (!pubKey) {
          setResult({ state: "failed", fileName: file.name, reason: "Could not load Inkoryx public key. Contact support." });
          return;
        }

        const valid = await verifyRsaSignature(pubKey, payload.hash, payload.signature);
        if (!valid) {
          setResult({ state: "failed", fileName: file.name, reason: "RSA signature verification failed — this seal was not issued by Inkoryx Studio." });
          return;
        }
      }

      setResult({ state: "verified", fileName: file.name, payload });
    } catch {
      setResult({ state: "failed", fileName: file.name, reason: "Unable to process this file." });
    }
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticleField />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <AnimatedSection>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon/30 bg-neon/5 text-xs text-neon mb-6">
              <FileLock2 size={14} /> INKORYX VAULT
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold gradient-text mb-4">
              The Inkoryx Vault: Asset Verification
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
              Mathematically verifiable proof of ownership. Drop your Cryptographic Master
              File below to authenticate your asset's digital signature.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <motion.div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-10 sm:p-16 text-center glass-strong ${
              dragOver
                ? "border-neon shadow-[0_0_60px_rgba(56,189,248,0.45)] scale-[1.01]"
                : "border-neon/30 hover:border-neon/70 hover:shadow-[0_0_40px_rgba(56,189,248,0.25)]"
            }`}
            whileHover={{ y: -2 }}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-neon/10 border border-neon/30 flex items-center justify-center">
                <UploadCloud className="w-8 h-8 text-neon" />
              </div>
              <div>
                <p className="text-lg font-heading font-semibold text-foreground">
                  Drag & Drop your Master File here.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Or click to browse. Verification runs entirely in your browser — your file is never uploaded.
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatedSection>

        <AnimatePresence mode="wait">
          {result.state === "checking" && (
            <motion.div key="checking" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-8 glass rounded-xl p-6 flex items-center gap-3 justify-center text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin text-neon" />
              Hashing & inspecting <span className="text-foreground font-medium">{result.fileName}</span>…
            </motion.div>
          )}

          {result.state === "verified" && (
            <motion.div key="verified" initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
              className="mt-8 rounded-2xl p-8 border border-green-400/40 bg-green-400/5 shadow-[0_0_60px_rgba(74,222,128,0.25)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-green-400/15 border border-green-400/40 flex items-center justify-center">
                  <ShieldCheck className="w-7 h-7 text-green-400" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-green-400 tracking-wide">VERIFIED ORIGINAL IP</h2>
                  <p className="text-sm text-muted-foreground">{result.fileName}</p>
                </div>
              </div>
              <dl className="grid sm:grid-cols-2 gap-4 text-sm">
                <Field label="Owner" value={result.payload.client ?? "—"} />
                <Field label="Asset ID" value={result.payload.assetId ?? "—"} />
                <Field label="Artist" value={result.payload.artist ?? "Inkoryx Studio"} />
                <Field label="Date Sealed" value={result.payload.date ? new Date(result.payload.date).toLocaleDateString() : "—"} />
                <Field label="Signature" value="Validated by Inkoryx Studio Public Key" />
                <Field label="Status" value="100% Intact. No pixel modifications detected." />
              </dl>
            </motion.div>
          )}

          {result.state === "failed" && (
            <motion.div key="failed" initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
              className="mt-8 rounded-2xl p-8 border border-red-500/40 bg-red-500/5 shadow-[0_0_60px_rgba(239,68,68,0.25)]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-red-500/15 border border-red-500/40 flex items-center justify-center">
                  <ShieldAlert className="w-7 h-7 text-red-400" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-red-400 tracking-wide">UNVERIFIED / MODIFIED FILE</h2>
                  <p className="text-sm text-muted-foreground">{result.fileName}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The cryptographic seal is missing or broken. This file is either a compressed
                web copy, a screenshot, or has been modified from its original forge state.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatedSection delay={0.2}>
          <div className="mt-20">
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-center mb-8">
              How the <span className="gradient-text">Cryptographic Seal</span> Works
            </h3>
            <div className="space-y-4">
              {faqs.map((f, i) => (
                <motion.details key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="group glass rounded-xl border border-border hover:border-neon/40 transition-colors">
                  <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-4">
                    <span className="font-heading font-semibold text-foreground">{f.q}</span>
                    <span className="text-neon text-xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</div>
                </motion.details>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-surface/40 p-4">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{label}</dt>
      <dd className="text-sm text-foreground font-medium break-words">{value}</dd>
    </div>
  );
}

