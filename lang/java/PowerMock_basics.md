# PowerMockでMockitoを拡張

## Mockitoの制約

- テストできるのは, publicメソッドのみ
- もちろん, static/finalではないメソッドはテストできない

## PowerMockが提供すること

- ガイド
  - [powermock / powermock](https://github.com/powermock/powermock)
  - [Introduction to PowerMock @baeldung](https://www.baeldung.com/intro-to-powermock)

- モックライブラリの拡張
  - Mockito, EasyMockとほぼ同じAPIを持っている
  - public以外, static/finalなメソッドもモック可能

## 使い方

- Mockito2かつJUnit4のAPIを使う前提で..
- 以下の依存関係を入れる(Maven等のパッケージマネージャーを使う)
  - `powermock-module-junit4`
  - `powermock-api-mockito2`
- テストクラスに `@RunWith(PowerMockRunner.class)`
- モック対象を `@PrepareForTest({mockClass.class, ...})` で定義
- モックする
  - `mockStatic(hoge.class);`
- 検証もできる
  - `verifyStatic(hoge.class);`

```java
package com.ponzmild.useradmin.dao;

import static org.junit.Assert.assertEquals;
import static org.powermock.api.mockito.PowerMockito.mockStatic;
import static org.powermock.api.mockito.PowerMockito.verifyStatic;
import static org.powermock.api.mockito.PowerMockito.when;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import com.ponzmild.useradmin.entity.User;
import com.ponzmild.useradmin.util.IdGenerator;

@RunWith(PowerMockRunner.class)
@PrepareForTest({IdGenerator.class})
public class UserDaoTest {

  @Test
  public void createShouldReturnAUserId() {
    UserDao dao = new UserDao();

    // Mockitoではできなかったstaticクラスのメソッドをモックできる!!
    mockStatic(IdGenerator.class);
    when(IdGenerator.generateId()).thenReturn(1);

    int result = dao.create(new User());
    assertEquals(1, result);
    // 検証も可能
    verifyStatic(IdGenerator.class);
  }
}
```