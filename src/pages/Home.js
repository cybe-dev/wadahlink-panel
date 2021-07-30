import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import BigLoading from "../components/BigLoading";
import Button from "../components/Button";
import Modal from "../components/Modal";
import TextInput from "../components/TextInput";
import { errorMsg } from "../config";
import service from "../service";
import {
  push,
  reset as reorder,
  replace,
  destroy,
} from "../redux/reducers/data";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import LinkList from "../components/LinkList";
import { useDebounce } from "../debounce";
import { Helmet } from "react-helmet-async";

export default function Home() {
  const _firstDataSet = useRef(false);
  const [id, setId] = useState(0);
  const links = useSelector((state) => state.data.link);
  const [data, setData] = useState([]);
  const _addModalRef = useRef();
  const _loading = useRef();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const _addLink = ({ name, url }) => {
    _loading.current.show();
    const payload = {
      name,
      url,
    };

    const index = data.findIndex((predicate) => predicate.id === id);

    if (!id) payload.sort = data.length + 1;
    service({
      url: id ? `/api/link/${id}` : "/api/link",
      method: id ? "PUT" : "POST",
      data: payload,
    })
      .then((response) => {
        const {
          id: linkId,
          user_id,
          name,
          url,
          sort,
          created_at,
          updated_at,
        } = response.data;
        _loading.current.success();
        reset();
        _addModalRef.current.hide();
        if (!id) {
          dispatch(
            push({
              data: {
                id: linkId,
                user_id,
                name,
                url,
                sort,
                created_at,
                updated_at,
              },
            })
          );
          setData((value) =>
            value.concat([
              { id: linkId, user_id, name, url, sort, created_at, updated_at },
            ])
          );
        } else {
          dispatch(
            replace({
              index,
              data: {
                id: linkId,
                user_id,
                name,
                url,
                sort,
                created_at,
                updated_at,
              },
            })
          );
          setData((value) => {
            const data = value;
            data[index] = {
              id: linkId,
              user_id,
              name,
              url,
              sort,
              created_at,
              updated_at,
            };
            return [...data];
          });
        }
      })
      .catch((e) => {
        _loading.current.hide();
      });
  };

  const _pushToServer = (data) => {
    const ordering = [];
    let i = 0;
    for (let link of data) {
      ordering.push({
        id: link.id,
        sort: i,
      });
      i++;
    }

    service
      .put("/api/link/reorder", {
        links: ordering,
      })
      .then((response) => {})
      .catch((e) => {});
  };

  const debounce = useCallback(
    useDebounce((data) => _pushToServer(data), 2000),
    []
  );

  const _modifyingList = useCallback(
    (e) => {
      const { destination, source } = e;

      if (!destination) {
        return;
      }

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      const getData = [...links];
      const sourceData = getData[source.index];
      getData.splice(source.index, 1);
      getData.splice(destination.index, 0, sourceData);
      dispatch(reorder({ data: [...getData] }));
      setData([...getData]);
      debounce([...getData]);
    },
    [links, debounce, dispatch]
  );

  const _destroy = (id, index) => {
    _loading.current.show();
    service
      .delete(`/api/link/${id}`)
      .then((response) => {
        _loading.current.success();
        dispatch(destroy({ index }));

        setData((value) => {
          const data = [...value];
          data.splice(index, 1);
          return [...data];
        });
      })
      .catch((e) => {
        _loading.current.hide();
      });
  };

  useEffect(() => {
    if (links.length > 0 && !_firstDataSet.current && data.length < 1) {
      setData([...links]);
      _firstDataSet.current = true;
    }
  }, [links, data]);

  return (
    <Fragment>
      <Helmet>
        <title>Link</title>
      </Helmet>
      <Button
        draggable={true}
        type="button"
        className="w-48"
        onClick={() => {
          setId(0);
          if (id) {
            reset({ name: "", url: "" });
          }
          _addModalRef.current.show();
        }}
      >
        Tambah Link
      </Button>
      <DragDropContext onDragEnd={_modifyingList}>
        <Droppable droppableId="drop-1">
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {data.map((item, index) => (
                <Draggable
                  key={`${index}`}
                  draggableId={`draggable-${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <LinkList
                      onEdit={() => {
                        setId(item.id);
                        reset({ name: item.name, url: item.url });

                        _addModalRef.current.show();
                      }}
                      onDelete={() => _destroy(item.id, index)}
                      name={item.name}
                      url={item.url}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Modal title={(!id ? "Tambah" : "Edit") + " Link"} ref={_addModalRef}>
        <form onSubmit={handleSubmit(_addLink)}>
          <TextInput
            type="text"
            containerClassName="mb-4"
            placeholder="Nama Link"
            {...register("name", { required: errorMsg.required })}
            error={errors.name?.message}
          />
          <TextInput
            type="text"
            containerClassName="mb-4"
            placeholder="URL (http://google.com)"
            {...register("url", { required: errorMsg.required })}
            error={errors.url?.message}
          />
          <Button type="submit" className="w-full">
            {!id ? "Tambah" : "Edit"}
          </Button>
        </form>
      </Modal>
      <BigLoading ref={_loading} />
    </Fragment>
  );
}
