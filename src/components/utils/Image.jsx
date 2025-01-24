import Image from "next/image";

const allowedDomains = [
  "https://static-api.nkstatic.com",
  "https://data.ninjakiwi.com",
  "https://mediabtd6maplist.sarto.dev",
  "https://media.sarto.dev/btd6maplist",
];

/**
 * While next/image is very useful, it bricks if the src doesn't come from
 * specified domains. While good for security, it's also annoying. This component is a failsafe
 * to fallback to <img> in the rare occasion a domain I didn't think of passes through.
 */
export default function ImageTagSwitch(props) {
  for (const domain of allowedDomains) {
    if (props.src.startsWith(domain)) {
      return <Image {...props} />;
    }
  }

  const newProps = { ...props };
  delete newProps.width;
  delete newProps.height;
  return <img {...newProps} />;
}
