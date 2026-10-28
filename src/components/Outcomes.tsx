"use client";

import { site } from "@/content/site";
import { Flashlight } from "./Flashlight";

function Grid({ lit }: { lit?: boolean }) {
  const List = lit ? "div" : "ul";
  const Item = lit ? "div" : "li";
  return (
    <List className={`outcomes__grid${lit ? " outcomes__grid--lit" : ""}`}>
      {site.outcomes.map((o) => (
        <Item className="outcome" key={o.label}>
          <span className="outcome__value display">{o.value}</span>
          <span className="outcome__label serif">{o.label}</span>
          <span className="outcome__detail mono">
            {o.detail}. {o.where}
          </span>
        </Item>
      ))}
    </List>
  );
}

/** Second use of the lamp: the numbers sit outlined until the beam fills them in. */
export function Outcomes() {
  return (
    <section id="outcomes" className="outcomes section-dark" aria-labelledby="outcomes-title">
      <div className="outcomes__head">
        <h2 id="outcomes-title" className="display">
          Measured, <span className="outline">not guessed</span>
        </h2>
        <p className="serif">
          Each figure belongs to a specific piece of shipped work. Run the lamp across them to see which.
        </p>
      </div>
      <Flashlight
        className="outcomes-lamp"
        base={<Grid />}
        reveal={<Grid lit />}
        radius={220}
        rest={{ x: 0.18, y: 0.3 }}
        showLabel="Show every figure"
        hideLabel="Back to the lamp"
      />
    </section>
  );
}
