import { Fragment } from "react";

export default function Heading({ title, subtitle }) {
  return (
    <Fragment>
      <h1 className="cabin text-2xl font-bold text-black-100">{title}</h1>
      <h2 className="text-black-200">{subtitle}</h2>
    </Fragment>
  );
}
