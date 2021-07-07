import {
  React,
  ReactDOM,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "./deps.ts";
import { generateImage } from "./canvas.ts";
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
  paletteName: PaletteName;
  current: PaletteName;
  title: string;
  description: string;
  colors: Palette;
  children?: React.ReactNode;
};

const PaletteSection = function (
  { paletteName, current, title, description, colors, children }:
    PaletteSectionType,
) {
  return (
    <section
      className="section"
      style={{ display: (current === paletteName) ? "block" : "none" }}
    >
      <h3>{title}</h3>
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
  const imageRef: any = useRef(null);
  const redrawEffect = useEffect(
    () => generateImage(data, imageRef.current?.getContext("2d")),
  );
  return (
    <div className="consumer">
      <div style={{ display: open ? "block" : "None" }}>
        <canvas
          id="mycanva"
          width="800"
          height="600"
          ref={imageRef}
        >
          No canvas supported.
        </canvas>
      </div>
    </div>
  );
};

const PaletteLabel = (
  { pname, setName, isCurrent }: {
    pname: PaletteName;
    setName: any;
    isCurrent: boolean;
  },
) => (<div
  className={isCurrent ? "paletteName currentPalette" : "paletteName"}
  key={pname}
  onClick={(e: any) => {
    setName(pname);
    console.log("Clicked palettelabel " + pname);
  }}
>
  {pname}
</div>);

const PaletteChoice = function (
  { paletteMap, current, setCurrent }: {
    paletteMap: Map<PaletteName, Palette>;
    current: PaletteName;
    setCurrent: any;
  },
) {
  return (
    <div>
      <h2>
        Choose your favourite palette and have an image generated automatically!
      </h2>
      <div className="paletteList">
        {Array.from(paletteMap.keys()).map((n) =>
          PaletteLabel({
            pname: n,
            setName: setCurrent,
            isCurrent: n === current,
          })
        )}
      </div>
    </div>
  );
};

const InitialData = {};
const App = (ad: AppData) => {
  const [input_string, setInputString] = useState(ad.input);
  const [paletteConfig, setPaletteConfig] = useState(ad.paletteConfig);
  const { baseCount, gradientSize, baseSaturation, baseLightness } =
    paletteConfig;

  const [currentPalette, setCurrentPalette] = useState(
    "BasicGradient" as PaletteName,
  );
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
        <p>First, let's calculate md5 sum of your input:</p>
        <MD5 data={input_string} />
        <p>
          Next, let's generate {baseCount}{" "}
          colors. Those colors' hua is taken from {baseCount}
          consecutive pairs of hexadecimal digits from md5 sum. Saturation is
          always {baseSaturation} and lightness is {baseLightness}
        </p>
        <Palette
          colors={colors}
        />
      </section>

      <PaletteChoice
        paletteMap={paletteMap}
        current={currentPalette}
        setCurrent={setCurrentPalette}
      />

      <PaletteSection
        paletteName="BasicColors"
        current={currentPalette}
        title="Initial colors"
        description={"Original generated colors list"}
        colors={paletteMap.get("BasicColors")!}
      >
      </PaletteSection>
      <PaletteSection
        paletteName="BasicGradient"
        current={currentPalette}
        title="Basic gradient"
        description={"This gradient is of size " + gradientSize +
          "from first (" + colors[0] + " ) and last (" + colors[baseCount - 1] +
          " color"}
        colors={paletteMap.get("BasicGradient")!}
      >
      </PaletteSection>

      <PaletteSection
        paletteName="AbsoluteGradient"
        current={currentPalette}
        title="Absolute gradient"
        description={" This is absolute gradient from middle color (" +
          middleColor(colors) + ") of your base colors."}
        colors={paletteMap.get("AbsoluteGradient")!}
      />
      <PaletteSection
        paletteName="RelativeLightness"
        current={currentPalette}
        title="Relative lightness"
        description={"This palette is generated by manipulating lightness from a color with highest hue (" +
          highestHue(colors) + ") of your base colors."}
        colors={paletteMap.get("RelativeLightness")!}
      />
      <PaletteSection
        current={currentPalette}
        paletteName="HueAndOpposite"
        title="Hue and opposite"
        description={" This palette is generated by manipulating lightness from a color with highest hue (" +
          highestHue + ") of your base colors."}
        colors={paletteMap.get("HueAndOpposite")!}
      />
      <PaletteConsumer
        data={paletteMap.get(currentPalette)!}
        paletteName={currentPalette}
      />
    </div>
  );
};

export default function renderApp(rootElem: HTMLElement) {
  ReactDOM.render(<App {...appData} />, rootElem);
}
