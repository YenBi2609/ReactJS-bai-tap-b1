import { Key, useEffect, useState, useMemo } from "react";

type Drink = {
  id: number;
  title: string;
};

const blackListCoffees = ["Black Coffee", "Svart Te", "Frapino Caramel"];

const ListCoffee = ({ search, data }: { search: string; data: Drink[] }) => {
  const [listSelected, setListSelected] = useState<string[]>([]);

  const listSelectedSorted = useMemo(() => {
    return [...listSelected].sort((a, b) => a.localeCompare(b));
  }, [listSelected]);

  return (
    <>
      <div className="fixed bottom-2 right-2 bg-gray-200 p-4">
        <div className="font-medium">Giỏ hàng:</div>
        <br />
        {Array.from(new Set(listSelectedSorted)).map(
          (item: string, index: number) => {
            return <span>{`${index !== 0 ? ", " : ""}${item}`}</span>;
          }
        )}
      </div>
      <ul>
        {data?.length !== 0 &&
          data
            .filter((item: Drink) => {
              if (blackListCoffees.includes(item.title)) {
                return false;
              }
              return search ? item.title.includes(search) : true;
            })
            .map((data: Drink, index: Key) => {
              return (
                <li
                  key={data.id}
                  className={`${
                    index === 0 ? "bg-violet-400" : "bg-red-300"
                  } ' px-4 py-2 my-2 text-[14px] text-black'`}
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 ml-4"
                    onChange={(event) => {
                      if (event.target.checked) {
                        setListSelected([...listSelected, data.title]);
                      } else {
                        setListSelected(
                          listSelected.filter(
                            (item: string) => item !== data.title
                          )
                        );
                      }
                    }}
                    id={data.title}
                  />
                  <label htmlFor={data.title} className="ml-[50%]">
                    {data.title}
                  </label>
                </li>
              );
            })}
      </ul>
    </>
  );
};

export default function Test() {
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [data, setData] = useState<Drink[]>([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // alert("Chúc mừng bạn trúng thưởng iPhone 17");
    }, 1000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const getData = async () => {
    try {
      const resp = await fetch("https://api.sampleapis.com/coffee/hot");
      const json = await resp.json();
      if (!json?.error) {
        setData(json);
      } else {
        console.log(json?.error);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      } else {
        console.log("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <input
        placeholder="Search here"
        type="text"
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        className="mb-4 border-red-500 border"
      />
      <ListCoffee search={debouncedSearch} data={data} />
    </>
  );
}
