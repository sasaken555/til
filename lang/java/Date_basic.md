# Date オブジェクトのメモ

## 基本

- `java.util.Date` パッケージのクラス
- 精度はミリ秒で保持しているようだ
- JavaDoc: [Date (Java Platform SE 8)](https://docs.oracle.com/javase/jp/8/docs/api/java/util/Date.html)

## メソッドの Tips

日付比較系のメソッドとして`before`,`after`,`compareTo`の 3 つがある.  
`compareTo`はインスタンスと引数のどっちが大きい時になんだっけ?迷うので, `before`や`after`を使った方がいいかも.

- boolean before(Date when) ... when 以前の日時であれば true を返す
- boolean after(Date when) ... when 以降の日時であれば true を返す
- int compareTo(Date anotherDate) ... anotherDate 以前であれば負の値, 以降であれば正の値, 同じであれば 0 を返す

## 日付項目のチェック

### フォーマット

正規表現 or `SimpleDateFormat.parse` を使うことで検証可能.  
正規表現の場合の例は以下の通り.

- yyyy/mm/dd

```
^(\d{4})/(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])$
```

- yyyyMMddHHmmss

```
^(\\d{4})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])([01][0-9]|2[0-3])([0-5][0-9])([0-5][0-9])
```

### 過去/未来日チェック

- Java Bean Validation のアノテーションを使う場合
  - `@Past`, `@Future`を使える!
