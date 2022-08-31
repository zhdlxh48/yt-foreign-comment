import { google } from "googleapis";

export type Comment = {
  text: string;
  displayName: string;
  profileImageUrl: string;
  likeCount: number;
  publishAt: string;
};

async function getPageComments(
  videoId: string,
  order: "relevance" | "time",
  pageLength: number = 500,
  pageToken?: string
): Promise<{ nextPageToken?: string; comments: Comment[] }> {
  const result = await google.youtube({ version: "v3" }).commentThreads.list({
    part: ["id", "snippet"],
    videoId,
    order,
    key: process.env.NEXT_APP_GOOGLE_API_KEY,
    maxResults: pageLength,
    pageToken: pageToken,
  });

  const { nextPageToken, items } = result.data;

  return {
    nextPageToken: nextPageToken || undefined,
    comments: items.map((cmt) => {
      const snip = cmt.snippet.topLevelComment.snippet;
      return {
        text: Buffer.from(snip.textOriginal, "utf-8").toString().trim(),
        displayName: snip.authorDisplayName.trim(),
        profileImageUrl: snip.authorProfileImageUrl,
        likeCount: snip.likeCount,
        publishAt: snip.publishedAt,
      };
    }),
  };
}

export async function getAllComments(
  videoId: string,
  order: "relevance" | "time",
  pageLength: number = 500
): Promise<Comment[]> {
  let comments: Comment[] = [];
  let nextPageToken = "";

  do {
    const result = await getPageComments(
      videoId,
      order,
      pageLength,
      nextPageToken
    );
    comments.push(...result.comments);
    nextPageToken = result.nextPageToken;
  } while (nextPageToken != undefined);

  console.log("[총 댓글] " + comments.length + "개");

  return comments;
}
