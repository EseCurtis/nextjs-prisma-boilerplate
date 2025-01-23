import Image from "next/image";

export function Logo() {
  return <Image src={"/logo.png"} width={500} height={500} alt="logo" />;
}

export function LogoWordMark({
  variant = "default"
}: {
  variant?: "white" | "black" | "default";
}) {
  const variants = {
    ["default"]: "/wordmark.png",
    ["black"]: "/wordmark-black.png",
    ["white"]: "/wordmark-white.png"
  };
  return (
    <Image
      src={variants[variant] || "/wordmark.png"}
      width={500}
      height={500}
      alt="logo"
    />
  );
}
