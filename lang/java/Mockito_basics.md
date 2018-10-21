# Mockitoを使ったモックの使い方

## Mockitoとは

- Javaのモックライブラリ
  - モック : 依存するクラス,メソッドの仮実装を提供するもの

- 他のモックライブラリ
  - [EasyMock](http://easymock.org/)
    - Mockitoとよく比較される見たい --> [Mockito vs EasyMock](https://github.com/mockito/mockito/wiki/Mockito-vs-EasyMock)
  - [JMockit](http://jmockit.github.io/)
    - 名前は似ているけど別物
    - `Expectations`, `Verifications`, `@Mocked`, `@Injectable`, `@Tested`, `MockUp` と書き方が全然違う

- 公式ガイド
  - [Mockito framework site](https://site.mockito.org/)
  - [Latest Documentation](https://static.javadoc.io/org.mockito/mockito-core/2.23.0/org/mockito/Mockito.html)
  - [How to write good tests](https://github.com/mockito/mockito/wiki/How-to-write-good-tests)

## Install

- `mockito-core` を依存関係に入れればOK
  - 2018/10/21現在, version2
- 実際には依存する他のライブラリ(Jar)が必要だったりするので, 手で入れるよりもMaven/Gradleで依存関係を一気に入れる方が吉

## 使い方

### Mock

- 差し替えたいクラスを宣言して `@Mock` を付与
  - アノテーションをつけたクラスのインスタンスはメソッドの中身が空になるようだ
- モックを初期化
  - `@Before` の中で `MockitoAnnotations.initMocks(testClass);`
  - もしくは, テストクラスの前に `@RunWith(MockitoJUnitRunner.StrictStubs.class)` をつける

- モックの挙動を定義

```java
// 値を返す
when(dao.create(any(Order.class))).thenReturn(new Integer(0));

// 例外を投げる
when(dao.create(any(Order.class))).thenThrow(SQLException.class);
```

- モックしたメソッドを本当に呼んでいるのか?何回呼ばれたのか?を検証するのは, `verify` メソッドの出番

```java
// モックを用意して実行するメソッドと返却値を定義
when(dao.read(anyInt())).thenReturn(new Order());

// 本当にモックが呼ばれているか?
verify(dao).read(ORDER_ID);
```

- `when`や`verify`といったMockitoのメソッドはstaticでimportしてあげること!!

### Spy

- Spyとは...
  - Mockと違って, 部分的に実装を差し替えたい場合に使う.
  - 差し替えていないメソッドが呼ばれた場合は,実際の実装メソッドが呼ばれる

- 使用するときは...
  - 部分モックしたいインスタンスに `@Spy` アノテーションをつける
  - テストメソッド内で@Mockと同じ書き方で差し替える
  - `Mockito.doReturn(3).when(myList).size();` とワンライナーで書いてもOK!

```java
package com.ponzmild.mockito.spy;

import static org.junit.Assert.assertSame;
import java.util.ArrayList;
import java.util.List;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.StrictStubs.class)
public class ListTest {

  // 部分モックする対象を @Spyで宣言
  @Spy
  List<String> myList = new ArrayList<>();

  @Test
  public void test() {
    // モックされていない add() メソッドは,本来の実装メソッドが実行される
    myList.add("Kentaro");
    myList.add("Hiromi");

    // 部分モックされた size() メソッドのみ差し替える
    Mockito.doReturn(3).when(myList).size();
    assertSame(3, myList.size());
  }
}
```