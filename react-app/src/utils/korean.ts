// 한글 낱말 끝에 받침이 있는지 봐서 '은/는'을 골라요. 예) 빵은, 고기는, 목은, 토는
// 한글이 아닌 글자로 끝나면(예: 숫자·영어) 받침을 알 수 없어서 '는'을 써요.
export const topicParticle = (word: string) => {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  const isHangul = code >= 0 && code < 11172;
  return isHangul && code % 28 !== 0 ? '은' : '는';
};
