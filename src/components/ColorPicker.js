import { Fragment, useState } from "react";
import { ChromePicker, SliderPicker } from "react-color";
import Button from "./Button";

export default function ColorPicker({ title, onChange, defaultColor }) {
  const [color, setColor] = useState(defaultColor || "#FFF");
  const [show, setShow] = useState(false);
  return (
    <Fragment>
      <div className="text-lg font-bold cabin text-black-100">{title}</div>
      {show ? (
        <div className="bg-white-100 mt-5 flex flex-col items-center">
          <ChromePicker
            color={color}
            onChange={(e) => {
              setColor(e.hex);
            }}
          />
          <div className="flex justify-center mt-3">
            <Button
              type="button"
              classBackground="bg-white-400 text-black-100 w-24 mr-5"
              onClick={() => {
                setShow(false);
              }}
            >
              Batal
            </Button>
            <Button
              type="button"
              classBackground="bg-black-200 w-24"
              onClick={() => {
                setShow(false);
                onChange(color);
              }}
            >
              Pilih
            </Button>
          </div>
        </div>
      ) : (
        <Fragment>
          <button
            type="button"
            className="h-32 w-full rounded mt-5 mb-3 border border-black-100"
            style={{ backgroundColor: color }}
          />
          <SliderPicker
            color={color}
            onChange={(e) => {
              setColor(e.hex);
            }}
            onChangeComplete={() => onChange(color)}
          />
          <button
            className="p-2 px-3 mt-2 bg-white-400 text-sm rounded"
            onClick={() => setShow(true)}
          >
            Lebih Banyak
          </button>
        </Fragment>
      )}
    </Fragment>
  );
}
