# JUnitの基本

## JUnit4 vs JUnit5

- JUnit5は以下のガイドを見ておけばOK
  - [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)

- Annotationの違い
  - 4: @Before, @After
  - 5: @BeforeEach, @AfterEach

- APIの違い
  - どうもパッケージ構成がガラッと変わり, JUnit5だけだとJUnit4のケースが流せなくなる見たい...
  > Unlike previous versions of JUnit, JUnit 5 is composed of several different modules from three different sub-projects.
  > 
  > JUnit 5 = JUnit Platform + JUnit Jupiter + JUnit Vintage

- JUnit5を使うとき...
  - Mavenで以下のライブラリを入れる
    - `junit-platform-runner`
    - `junit-jupiter-engine`
    - `junit-jupiter-api`
  - JUnit4のAPIを使ったテストケースを一緒に流したい場合は, JUnit Vintageを依存関係に入れておく.
    - `junit-vintage-engine`
  - テストクラスにJUnit5で動かすことを宣言
    - `@RunWith(JUnitPlatform.class)`

## 例外のテスト

- 期待する例外クラスを `@Test` につければOK.
  - Ex) `@Test(expected = SQLException.class)`

- TestRule(`ExpectedException`)を使って検証することもできる.
  - [ガイド](https://github.com/junit-team/junit4/wiki/exception-testing)

```java
@Rule
public ExpectedException thrown = ExpectedException.none();

@Test
public void shouldTestExceptionMessage() throws IndexOutOfBoundsException {
    List<Object> list = new ArrayList<Object>();

    thrown.expect(IndexOutOfBoundsException.class);
    thrown.expectMessage("Index: 0, Size: 0");
    list.get(0); // execution will never get past this line
```

- *TestRuleとは...
  - テストケースに拡張機能を与える.
  - [ガイド](https://junit.org/junit4/javadoc/4.12/org/junit/rules/TestRule.html)
  - `@Rule` で定義
    - Ex) `ExpectedException`, `TemporaryFolder`, `Timeout` etc...

## Parameterized Case

- テストで使用する値を別出ししてテストケースを実行することができる.
- パラメータを使ってJUnitのテストを流すと, 全ケース実行される.

### やり方

- テストクラスに `@RunWith(Parameterized.class)` をつける
- パラメータとして扱いたい変数をコンストラクタでセットする
- パラメータはstaticかつCollectionを返すメソッドを用意して, メソッドに `@Parameters` を付与する

```java
package com.ponzmild.maven.calculator;

import static org.junit.Assert.assertEquals;
import java.util.Arrays;
import java.util.Collection;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameters;

@RunWith(Parameterized.class)
public class CalculatorImplTest {

  private int num1;
  private int num2;
  private int expectedResult;

  /**
   * Constructor with all fields.
   * 
   * @param num1 input1
   * @param num2 input2
   * @param result result from num1, num2
   */
  public CalculatorImplTest(int num1, int num2, int result) {
    this.num1 = num1;
    this.num2 = num2;
    this.expectedResult = result;
  }

  @Parameters
  public static Collection<Integer[]> data() {
    return Arrays.asList(new Integer[][] {{-1, 2, 1}, {1, 2, 3}, {6, 7, 13}});
  }

  @Test
  public void addShouldReturnAResult() {
    Calculator c = new CalculatorImpl();
    int result = c.add(num1, num2);
    assertEquals(expectedResult, result);
  }

}
```