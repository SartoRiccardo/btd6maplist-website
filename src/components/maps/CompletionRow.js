import CompletionColumn from "./CompletionColumn";

export default function CompletionRow({
  completion,
  mapIdxCurver,
  mapIdxAllver,
  className,
  userEntry,
}) {
  completion = completion instanceof Array ? completion : [completion];

  return (
    <div className={`panel my-2 overflow-hidden ${className || ""}`}>
      <div className="row">
        <div className="col-12 col-md-5 col-lg-7 align-self-center">
          {userEntry}
        </div>

        <div className="col-12 col-md-7 col-lg-5 align-self-center">
          <CompletionColumn
            completion={completion}
            mapIdxCurver={mapIdxCurver}
            mapIdxAllver={mapIdxAllver}
          />
        </div>
      </div>
    </div>
  );
}
