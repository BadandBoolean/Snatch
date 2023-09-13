// in this file I want to return the image that will be used by Open Graph for the link preview

export default function Linkimg() {
  return (
    <div
      style={{
        display: "flex",
        background: "#f6f6f6",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img width="256" height="256" src="./ogimg.png" />
    </div>
  );
}
