# ランダムな文字列を生成する方法

## 生成方法

- UUID を使用する
  - `UUID.randomUUID.toString()`で文字列として生成可能
  - 16 進数文字列(0-9,a-f,A-F)のみ
  - 36 桁
  - JavaDoc: [UUID (Java Platform SE 8)](https://docs.oracle.com/javase/jp/8/docs/api/java/util/UUID.html#toString--)
- SecureRandom を使う
  - 暗号用に強化された乱数ジェネレータ
  - UUID の内部でも使われている.
  - JavaDoc: [SecureRandom (Java Platform SE 8)](https://docs.oracle.com/javase/jp/8/docs/api/java/security/SecureRandom.html)
  - UUID よりも多くの文字を使う場合にはこっちの方が便利かもしれない.

## 生成例

- https://code.i-harness.com/ja/q/a093

```java
/**
 * ランダムな文字列を生成
 *
 * @param length 生成する文字列長
 * @return ランダム文字列
 */
public static String createRandomString(int length) {

    final String charOption = "abcdefghijklmnopqrstuvwxyz0123456789";
    StringBuffer sb = new StringBuffer();

    for (int i = 0; i < length; i++) {
        int randomInt = new SecureRandom().nextInt(charOption.length());
        sb.append(charOption.charAt(randomInt));
    }

    return sb.toString();
}
```
