export default function DiscordWidget() {
  return (
    <iframe
      src={`https://discord.com/widget?id=${process.env.NEXT_PUBLIC_MLIST_GUILD}&theme=dark`}
      width="350"
      height="300"
      allowtransparency="true"
      loading="lazy"
      //   frameBorder="0"
      sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
    />
  );
}
