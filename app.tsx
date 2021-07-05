import { React, ReactDOM, useState } from "./deps.ts";
import {
  colToHsl,
  generateAbsoluteGradient,
  generatePalette,
  generateRelativeLightness,
  generateShadeWithOpposite,
  genN,
  inverse,
  sortedByHue,
} from "./colors.ts";
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
  colors: string[];
};

const PaletteSection = function (
  { title, description, colors }: PaletteSectionType,
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
    </section>
  );
};
const MD5 = function ({ data }: { data: string }) {
  return (
    <strong>{md5sum(data)}</strong>
  );
};
const App = (ad: AppData) => {
  const [input_string, setInputString] = useState(ad.input);

  const baseCount = 5;
  const [baseSaturation, baseLightness] = [80, 50];
  const colors = genN({
    data: input_string,
    count: baseCount,
    baseSaturation,
    baseLightness,
  });
  console.log("colors are: ", colors);
  const gradientSize = 7;
  const middleColor = colors[Math.round(colors.length / 2)];
  const byHue = sortedByHue(colors);
  const highestHue = byHue[0];

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
      <PaletteSection
        title="Basic gradient"
        description={"This gradient is of size " + gradientSize +
          "from first (" + colors[0] + " ) and last (" + colors[baseCount - 1] +
          " color"}
        colors={generatePalette(colors[0], colors[baseCount - 1], gradientSize)}
      />

      <PaletteSection
        title="Absolute gradient"
        description={" This is absolute gradient from middle color (" +
          middleColor + ") of your base colors."}
        colors={generateAbsoluteGradient(middleColor, gradientSize)}
      />
      <PaletteSection
        title="Relative lightness"
        description={"This palette is generated by manipulating lightness from a color with highest hue (" +
          highestHue + ") of your base colors."}
        colors={generateRelativeLightness(highestHue, gradientSize)}
      />
      <PaletteSection
        title="Hue and opposite"
        description={" This palette is generated by manipulating lightness from a color with highest hue (" +
          highestHue + ") of your base colors."}
        colors={generateShadeWithOpposite(highestHue, gradientSize)}
      />

      <PaletteSection
        title="Bonus!"
        description={"Some pink " + highestHue + " would no no harm :)"}
        colors={generateRelativeLightness("#AA1660", 5)}
      />
    </div>
  );
};

export default function renderApp(rootElem: HTMLElement) {
  ReactDOM.render(<App {...appData} />, rootElem);
}
