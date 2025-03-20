export default function capitalizeWord(s: string) : string {
  if (s.length == 0) {
    return '';
  }

  var word = s.charAt(0).toUpperCase();
  word += s.substring(1, s.length)
  return word
}