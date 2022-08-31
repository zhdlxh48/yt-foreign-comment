import cd from "cld";
import { Comment } from "./youtube";

export type ForeignComment = {
  language: string;
  text: string;
  displayName: string;
  profileImageUrl: string;
  likeCount: number;
  publishAt: string;
};

const langSep = "/";

export async function findForeignComments(
  comments: Comment[],
  detectionPercent: number = 40
): Promise<ForeignComment[]> {
  let fcmts: ForeignComment[] = [];
  for (let cmt of comments) {
    const text = cmt.text;
    if (text === undefined || text === null || text === "") continue;

    try {
      const result = await cd.detect(text);

      for (const lang of result.languages) {
        if (lang.code !== "ko" && lang.code !== "xx-Qaai") {
          if (lang.percent >= detectionPercent) {
            fcmts.push({
              language: result.languages
                .map((e) => e.name.toLowerCase())
                .join(langSep),
              ...cmt,
            });
            break;
          }
        }
      }
    } catch (error) {
      // console.log("<언어 감지 불가능> " + text);
      // console.log("----------");
    }
  }

  console.log("[해외 댓글] " + fcmts.length + "개");
  return fcmts;
}
