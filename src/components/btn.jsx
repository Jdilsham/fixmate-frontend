export default function Btn(props) {
  return (
    <button
      onClick={props.onClick}
      className={`w-[250PX] h-[41px] rounded-[15px] align-middle drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] ${props.bg} ${props.textColor} font-semibold`}
    >
      {props.label}
    </button>
  );
}
