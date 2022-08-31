import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Avatar, Button, Checkbox, Flex, Stack, Text } from "@chakra-ui/react";
import { GetServerSidePropsContext, NextPage } from "next";
import Link from "next/link";
import { ForeignComment } from "../../utils/language";
import FileSaver from "file-saver";
import { stringify } from "csv-stringify/sync";
import { useState } from "react";

type CommentProps = {
  comments: ForeignComment[];
};
const Comment: NextPage<CommentProps> = ({ comments }) => {
  const [cleanText, setCleanText] = useState<boolean>(false);

  return (
    <Flex
      direction="column"
      alignItems="center"
      p={8}
      background="blackAlpha.800"
    >
      <Stack direction="row" mb={8} alignItems="center">
        <Link
          href={{
            pathname: `/`,
          }}
        >
          <Button>메인 페이지</Button>
        </Link>
        <Button
          onClick={() => {
            const csv = stringify(
              cleanText
                ? comments.map((cmt) => {
                    cmt.text = cmt.text.replace(/\s+/g, " ").trim();
                    return cmt;
                  })
                : comments,
              { header: true }
            );
            const blob = new Blob([csv], {
              type: "text/csv;charset=utf-8;",
            });
            FileSaver.saveAs(blob, "data.csv");
          }}
        >
          CSV 다운로드
        </Button>
        <Checkbox
          color="white"
          isChecked={cleanText}
          onChange={(event) => {
            setCleanText(event.target.checked);
          }}
        >
          다운로드 시 댓글 엔터 정리
        </Checkbox>
      </Stack>
      <Flex direction="column">
        {comments.map((cmt, i) => {
          return (
            <Flex
              key={i}
              direction="row"
              justify="space-between"
              alignItems="flex-start"
            >
              <Flex gap={4} mr={12} my={5}>
                <Avatar size="md" mt={2} src={cmt.profileImageUrl} />
                <Stack direction="column">
                  <Stack direction="row" alignItems="flex-end">
                    <Text fontSize="xl" color="white">
                      {cmt.displayName}
                    </Text>
                    <Text fontSize="sm" color="whiteAlpha.700">
                      {cmt.publishAt}
                    </Text>
                  </Stack>
                  <Text fontSize="lg" color="white" whiteSpace="pre-line">
                    {cmt.text}
                  </Text>
                  <Stack direction="row" alignItems="center">
                    <TriangleUpIcon color="whiteAlpha.600" />
                    <Text color="whiteAlpha.800">{cmt.likeCount}</Text>
                    <TriangleDownIcon color="whiteAlpha.600" />
                  </Stack>
                </Stack>
              </Flex>
              <Stack direction="column" alignItems="center" mt={4}>
                <Button size="sm" disabled={true}>
                  이름 복사
                </Button>
                <Button size="sm" disabled={true}>
                  댓글 복사
                </Button>
              </Stack>
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  console.log(context.query);

  let id = context.query.id as string;
  if (typeof id !== "string") {
    console.log("not string");
    id = id[0];
  }
  let order = context.query.order as "relevance" | "time";
  if (typeof order !== "string") {
    console.log("not string");
    order = order[0];
  }
  let detect = context.query.detect as string;
  if (typeof detect !== "string") {
    console.log("not string");
    detect = detect[0];
  }

  const response = await fetch(
    `https://yt-foreign-comment.herokuapp.com/api/comment/${id}?order=${order}&detect=${detect}`
  );
  const result = await response.json();
  const curDate = new Date();
  const comments = (result.comments as ForeignComment[]).map((cmt) => {
    const date = new Date(cmt.publishAt);
    cmt.publishAt =
      `${date.getFullYear()}년 ${date.getMonth()}월 ${date.getDate()}일` +
      " " +
      (curDate.getFullYear() - date.getFullYear() > 0
        ? `(${curDate.getFullYear() - date.getFullYear()}년 전)`
        : curDate.getMonth() - date.getMonth() > 0
        ? `(${curDate.getMonth() - date.getMonth()}개월 전)`
        : curDate.getDate() - date.getDate() > 0 &&
          `(${curDate.getDate() - date.getDate()}일 전)`);
    return cmt;
  });

  return {
    props: {
      comments,
    }, // will be passed to the page component as props
  };
}

export default Comment;
