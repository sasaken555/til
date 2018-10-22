# Spring Frameworkでのテスト

## UTのやり方

### About

- 基本的にJUnitとモックライブラリの組み合わせ
- DIするため, 依存関係をモックする必要がある

### How to

- テストクラスに `@RunWith(SpringJUnit4ClassRunner.class)`
- beanの設定ファイルがあればそれを設定
  - `@ContextConfiguration(locations = "classpath:xxxx.xml")`
- モックするインスタンスにはMockitoの `@Mock`
- 依存性注入するインスタンスには
  - `@Autowired`で注入
  - `@InjectMocks`でインスタンスにモックを差し込む

## UTと結合テスト

- ほぼ同じ内容でUTと結合テストを実行できる
  - モックすればUT
  - モックを外して依存性注入を実際に行えば結合テストをそのまま実行可能!