import type { NextPage } from "next";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import {
  Button,
  Heading,
  Text,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControl,
  FormLabel,
  FormHelperText,
  Flex,
  CircularProgress,
  FormErrorMessage,
  RadioGroup,
  Stack,
  Radio,
} from "@chakra-ui/react";

const Home: NextPage = () => {
  const [youtubeId, setYoutubeId] = useState<string>("");
  const handleYoutubeIdChange = (event: ChangeEvent<HTMLInputElement>) =>
    setYoutubeId(event.target.value);
  const isYoutubeIdError = youtubeId === "";
  const [detectionPercent, setDetectionPercent] = useState<number>(40);
  const [orderWay, setOrderWay] = useState<string>("time");

  const [isClickedSubmit, setIsClickedSubmit] = useState<boolean>(false);

  return (
    <>
      <Flex direction="column" alignItems="center">
        <Heading>유튜브 해외 댓글 조회</Heading>
        <Text>
          유튜브에 달린 댓글 중 해외의 사람이 단 댓글로 추정되는 것을 추출합니다
        </Text>
      </Flex>

      <FormControl isInvalid={isYoutubeIdError}>
        <FormLabel>Youtube video id</FormLabel>
        <Input value={youtubeId} onChange={handleYoutubeIdChange} />
        {isYoutubeIdError && (
          <FormErrorMessage>Youtube video id is required</FormErrorMessage>
        )}
        <FormHelperText>
          https://www.youtube.com/watch?v=[THIS IS ID]
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Detection percentage</FormLabel>
        <NumberInput
          step={5}
          value={detectionPercent}
          min={5}
          max={100}
          onChange={(val) => {
            setDetectionPercent(parseInt(val));
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormHelperText>다른 나라의 언어가 차지하는 최소 비율</FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Comments ordering way</FormLabel>
        <RadioGroup onChange={setOrderWay} value={orderWay}>
          <Stack direction="row">
            <Radio value="time">최신순</Radio>
            <Radio value="relevance">인기순</Radio>
          </Stack>
        </RadioGroup>
        <FormHelperText>
          댓글의 정렬된 순서 (결과물의 정렬 순서를 보장하진 않음)
        </FormHelperText>
      </FormControl>

      <Link
        href={{
          pathname: `/comment/${youtubeId}`,
          query: { order: orderWay, detect: detectionPercent },
        }}
      >
        <Button
          onClick={() => {
            setIsClickedSubmit(true);
          }}
          disabled={isYoutubeIdError}
        >
          결과 조회
          {isClickedSubmit && (
            <CircularProgress
              size={6}
              ml={2}
              isIndeterminate
              color="green.300"
            />
          )}
        </Button>
      </Link>
    </>
  );
};

export default Home;
