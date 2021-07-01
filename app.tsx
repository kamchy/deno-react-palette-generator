import { React, ReactDOM, useState } from "./deps.ts";
import { colToHsl, genN, inverse, lighter } from "./colors.ts";
import { md5sum } from "./hash.ts";

type AppData = {
  title: string;
  info: string;
  infoImage: string;
  input: string;
};
const appData: AppData = {
  title: "My Colors",
  info: "Here you can generate color palettes based on your input.",
  infoImage: "images/image.jpg",
  input: "",
};

const Hero = ({ ad }: { ad: AppData }) => (
  <div className="hero">
    <h1>{ad.title}</h1>
    <div className="panel">
      <h2>{ad.info}</h2>
      <img src={ad.infoImage} />
    </div>
  </div>
);

type FormType = {
  label: string;
  placeholder: string;
  change: (s: string) => unknown;
};

const LineForm = ({ label, placeholder, change }: FormType) => (
  <form>
    <label htmlFor="line">{label}</label>
    <input
      type="text"
      id="line"
      placeholder={placeholder}
      onChange={(e) => change((e.target as any).value)}
    />
  </form>
);

type ColorBoxType = {
  wi?: number;
  hi?: number;
  color: string;
};

const ColorBox = ({ wi, hi, color }: ColorBoxType) => (
  <div
    className="colorbox"
    style={{
      backgroundColor: color,
      minWidth: wi,
      minHeight: hi,
    }}
  >
    <span
      style={{
        color: inverse(color),
        backgroundColor: color,
        padding: "10px",
      }}
    >
      {colToHsl(color).map((i) => i.toFixed(0)).join(" ")}
    </span>
  </div>
);

type PaletteData = {
  data: string;
  count: number;
};

const Palette = function ({ data, count }: PaletteData) {
  return (
    <div>
      {genN(data, count).map(function (c, idx) {
        return <ColorBox key={idx} color={c} />;
      })}
    </div>
  );
};

const MD5 = function ({ data }: { data: string }) {
  return (
    <h2>{md5sum(data)}</h2>
  );
};
const App = (ad: AppData) => {
  const [input_string, setInputString] = useState(ad.input);
  console.log(typeof setInputString);
  return (
    <div>
      <Hero ad={ad} />
      <section>
        <h1>Input</h1>
        <p>
          Colors generator uses your input (text you write below) to generate
          images, colors and palletes.
        </p>
        <p>Please enter some data below:</p>
        <LineForm
          label="Your input:"
          placeholder="I love cats"
          change={(s: string) => setInputString(s)}
        />
      </section>
      <section>
        <h1>Generated data</h1>
        <p>Your input is {input_string}</p>
        <MD5 data={input_string} />
        <h2>Generated palette</h2>
        <Palette data={input_string} count={5} />
      </section>
    </div>
  );
};

export default function renderApp(rootElem: HTMLElement) {
  ReactDOM.render(<App {...appData} />, rootElem);
}
