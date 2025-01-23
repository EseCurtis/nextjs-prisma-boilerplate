import { Breadcrumbs } from "@material-tailwind/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdHome } from "react-icons/md";

export function BreadcrumbsDefault() {
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((x) => x);

  return (
    <Breadcrumbs placeholder onPointerEnterCapture onPointerLeaveCapture>
      <Link href="/" className="opacity-60 hover:text-accent">
        <MdHome />
      </Link>
      {pathnames.map((value: string, index: number) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        return isLast ? (
          <span key={to} className=" hover:text-accent">
            {value}
          </span>
        ) : (
          <Link key={to} href={to} className="opacity-60 hover:text-accent">
            {value}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
