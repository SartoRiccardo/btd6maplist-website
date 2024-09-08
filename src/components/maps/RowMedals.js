const medal_size = 45;
export default function RowMedals({ black_border, no_geraldo, current_lcc }) {
  return (
    <div>
      <img
        src={black_border ? "/medal_bb.webp" : "/medal_win.webp"}
        width={medal_size}
        height={medal_size}
      />
      <img
        src="/medal_nogerry.webp"
        width={medal_size}
        height={medal_size}
        className={`${!no_geraldo ? "comp-blocked" : ""} mx-2`}
      />
      <img
        src="/medal_lcc.webp"
        width={medal_size}
        height={medal_size}
        className={!current_lcc ? "transparent" : ""}
      />
    </div>
  );
}
