import { useCallback, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import Card from "../components/Card";
import ColorPicker from "../components/ColorPicker";
import { useDebounce } from "../debounce";
import { design } from "../redux/reducers/data";
import service from "../service";

export default function Design() {
  const dispatch = useDispatch();
  const { design: designs } = useSelector((state) => state.data);

  const _save = (data) => {
    service
      .put("/api/design", {
        ...data,
      })
      .then((response) => {})
      .catch((e) => {});
  };

  const debounce = useCallback(
    useDebounce((data) => _save(data), 5000),
    []
  );

  const _changing = (field, value) => {
    const data = {};
    data[field] = value;
    const designCurrent = { ...designs, ...data };
    dispatch(design({ ...data }));
    debounce(designCurrent);
  };
  return (
    <div className="grid grid-flow-row grid-cols-1 lg:grid-cols-2 gap-5">
      <Helmet>
        <title>Desain</title>
      </Helmet>
      <Card>
        <ColorPicker
          title="Background Utama"
          defaultColor={designs.page_background || "#FFF"}
          onChange={(e) => {
            _changing("page_background", e);
          }}
        />
      </Card>
      <Card>
        <ColorPicker
          title="Text Nama"
          defaultColor={designs.name_color || "#333"}
          onChange={(e) => {
            _changing("name_color", e);
          }}
        />
      </Card>
      <Card>
        <ColorPicker
          title="Background Link"
          defaultColor={designs.link_background || "#333"}
          onChange={(e) => {
            _changing("link_background", e);
          }}
        />
      </Card>
      <Card>
        <ColorPicker
          title="Text Link"
          defaultColor={designs.link_color || "#FFF"}
          onChange={(e) => {
            _changing("link_color", e);
          }}
        />
      </Card>
    </div>
  );
}
