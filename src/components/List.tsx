import styled from "@emotion/styled";
import { FC, useEffect, useRef, useState } from "react";
import { Item } from "./Item";
import { SafelyRenderChildren } from "./SafelyRenderChildren";

const ScrollWrapper = styled.div`
  border: 1px solid black;
  width: 100%;
  width: 100%;
  height: 500px;
  overflow: auto;
`;

const ListWrapper = styled.ul`
  margin: 0;
  padding: 0;
`;

export interface ListProps {
  items: string[];
}

export const List: FC<ListProps> = ({ items }: any) => {
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const [number, setNumber] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");

  const handleScroll = () => {
    const scrollWrapper = scrollWrapperRef.current;
    if (scrollWrapper) {
      const scrollTop = scrollWrapper.scrollTop;
      const scrollHeight = scrollWrapper.scrollHeight;
      const clientHeight = scrollWrapper.clientHeight;

      if (scrollTop + clientHeight === scrollHeight) {
        setNumber(number + 100);
      }
    }
  };

  useEffect(() => {
    const scrollWrapper = scrollWrapperRef.current;

    if (scrollWrapper) {
      scrollWrapper.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollWrapper) {
        scrollWrapper.removeEventListener("scroll", handleScroll);
      }
    };
  }, [scrollWrapperRef, number]);

  const filteredItems = items
    .filter((item: any) =>
      item.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, number);

  return (
    <>
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          border: "1px solid white",
          marginBottom: 10,
          width: "100%",
          height: 30,
        }}
      />

      <ScrollWrapper ref={scrollWrapperRef}>
        <ListWrapper>
          {/**
           * Note: `SafelyRenderChildren` should NOT be removed while solving
           * this interview. This prevents rendering too many list items and
           * potentially crashing the web page. This also enforces an artificial
           * limit (5,000) to the amount of children that can be rendered at one
           * time during virtualization.
           */}

          <SafelyRenderChildren>
            {filteredItems.map((word: any) => {
              return <Item key={word}>{word}</Item>;
            })}
          </SafelyRenderChildren>
        </ListWrapper>
      </ScrollWrapper>
    </>
  );
};
