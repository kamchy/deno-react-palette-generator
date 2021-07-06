import { React, ReactDOM, useState } from "./deps.ts";
import {
  createPaletteMap,
  highestHue,
  middleColor,
  Palette,
  PaletteConfig,
  PaletteName,
} from "./palettes.ts";
import { colToHsl, genN, inverse } from "./colors.ts";
import { md5sum } from "./hash.ts";

type AppData = {
  title: string;
  info: string;
  infoImage: string;
  input: string;
  paletteConfig: PaletteConfig;
};
const appData: AppData = {
  title: "My Colors",
  info: "Here you can generate color palettes based on your input.",
  infoImage: "images/image.jpg",
  input: "Deno",
  paletteConfig: {
    gradientSize: 7,
    baseSaturation: 80,
    baseLightness: 50,
    baseCount: 5,
  },
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
      }}
    >
      hsl({colToHsl(color).map((i) => i.toFixed(0)).join(",")})
    </span>
    <span
      style={{
        color: inverse(color),
        backgroundColor: color,
      }}
    >
      {color}
    </span>
  </div>
);

const Palette = function (
  { colors }: { colors: string[] },
) {
  return (
    <div className="palette">
      {colors.map(
        function (c, idx) {
          return <ColorBox key={idx} color={c} />;
        },
      )}
    </div>
  );
};

type PaletteSectionType = {
  title: string;
  description: string;
  colors: Palette;
  children?: React.ReactNode;
};

const PaletteSection = function (
  { title, description, colors, children }: PaletteSectionType,
) {
  return (
    <section className="section">
      <h2>{title}</h2>
      <p>
        {description}
      </p>
      <Palette
        colors={colors}
      />
      {children}
    </section>
  );
};
const MD5 = function ({ data }: { data: string }) {
  return (
    <strong>{md5sum(data)}</strong>
  );
};

const PaletteConsumer = function (
  { data, paletteName }: { data: string[]; paletteName: PaletteName },
) {
  const [open, setOpen] = useState(true);
  return (
    <div className="consumer">
      <label>
        <input
          type="checkbox"
          checked={open}
          onChange={(e) => setOpen(!open)}
        />Show image generated with palette {paletteName}
      </label>
      <div style={{ display: open ? "block" : "None" }}>
        {data
          ? data.map(
            function (c, idx) {
              return (<span key={idx}>{c}</span>);
            },
          )
          : "No palette chosen"},
      </div>
    </div>
  );
};

const PaletteChoice = function (
  { paletteMap }: { paletteMap: Map<PaletteName, Palette> },
) {
  const [name, setName] = useState(
    "BasicGradient" as PaletteName,
  );

  return (
    <div>
      <input
        list="palettes"
        onChange={(e: any) => setName(e.target.value)}
        type="text"
      />
      <label>{name}</label>
      <datalist id="palettes">
        {Array.from(paletteMap.keys()).map((
          k,
        ) => (<option key={k} value={k} />))}
      </datalist>
      <PaletteConsumer data={paletteMap.get(name)!} paletteName={name} />
    </div>
  );
};

const InitialData = {};
const App = (ad: AppData) => {
  const [input_string, setInputString] = useState(ad.input);
  const [paletteConfig, setPaletteConfig] = useState(ad.paletteConfig);
  const { baseCount, gradientSize, baseSaturation, baseLightness } =
    paletteConfig;

  const colors = genN(
    input_string,
    baseCount,
    baseSaturation,
    baseLightness,
  );

  const paletteMap = createPaletteMap(input_string, paletteConfig, colors);

  return (
    <div>
      <Hero ad={ad} />
      <section>
        <h2>Take some input</h2>
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
        <h2>Generate data</h2>
        <p>First, let's calculate md5 sum of your input:</p>
        <MD5 data={input_string} />
        <h2>Generate {baseCount} colors</h2>
        <p>
          Those colors' hue is taken from {baseCount}{" "}
          consecutive pairs of hexadecimal digits from md5 sum. Saturation is
          always {baseSaturation} and lightness is {baseLightness}
        </p>
        <Palette
          colors={colors}
        />
      </section>
      <PaletteChoice paletteMap={paletteMap} />
      <PaletteSection
        title="Basic gradient"
        description={"This gradient is of size " + gradientSize +
          "from first (" + colors[0] + " ) and last (" + colors[baseCount - 1] +
          " color"}
        colors={paletteMap.get("BasicGradient")!}
      >
      </PaletteSection>
      <PaletteConsumer
        data={paletteMap.get("BasicGradient")!}
        paletteName={"BasicGradient"}
      />

      <PaletteSection
        title="Absolute gradient"
        description={" This is absolute gradient from middle color (" +
          middleColor(colors) + ") of your base colors."}
        colors={paletteMap.get("AbsoluteGradient")!}
      />
      <PaletteSection
        title="Relative lightness"
        description={"This palette is generated by manipulating lightness from a color with highest hue (" +
          highestHue(colors) + ") of your base colors."}
        colors={paletteMap.get("RelativeLightness")!}
      />
      <PaletteSection
        title="Hue and opposite"
        description={" This palette is generated by manipulating lightness from a color with highest hue (" +
          highestHue + ") of your base colors."}
        colors={paletteMap.get("HueAndOpposite")!}
      />
    </div>
  );
};

export default function renderApp(rootElem: HTMLElement) {
  ReactDOM.render(<App {...appData} />, rootElem);
}
