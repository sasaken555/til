# Memcached をプログラムから扱う

## Memcached の基本

- キャッシュを扱うデータストアの 1 つ.
- 類似する奴は Radis.
- キャッシュ戦略は LRU(Least Recently Used)を使う.

## 準備

- Mac の場合は, `brew install memcached` でインストール可能
  - 起動は `memcached -d -p <port>`
- Docker から扱う場合は, `docker pull memcached` で OK!

## Java から Memcached を使う例

- Java から扱うには, クライアントとして spymemcached を入れる
- Maven なら, 以下のように pom.xml に依存関係を追加して `maven update` すればよろしい

```xml
<dependency>
  <groupId>junit</groupId>
  <artifactId>junit</artifactId>
  <version>4.12</version>
  <scope>test</scope>
</dependency>
```

### プログラム例

```java
package com.ponzmild.example;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import net.spy.memcached.MemcachedClient;

public class App {

  /** Memcached接続情報. */
  private static String MEMCACHE_HOST = "localhost";
  private static int MEMCACHE_PORT = 11211;
  private static int CACHE_EXPIRATION_SEC = 180; // = 3min

  /**
   * エントリーポイント.
   * @param args 引数
   */
  public static void main(String[] args) {
    MemcachedClient client = null;
    try {
      client = new MemcachedClient(new InetSocketAddress(MEMCACHE_HOST, MEMCACHE_PORT));
      System.out.println("Successfully Connected to Memcached Server :)");
    } catch (IOException e) {
      System.out.println("Failed to Connect to Memcached Server...");
      e.printStackTrace();
    }

    // Set / Get Cache!!
    // シンプルに文字列を出し入れ
    String cachedHoge = (String) client.get("hoge");
    System.out.println("Is cachedHoge exists? ... " + Objects.nonNull(cachedHoge));
    if (Objects.nonNull(cachedHoge)) {
      System.out.println("cachedHoge is ... " + cachedHoge);
    }

    client.set("hoge", CACHE_EXPIRATION_SEC, "hello from memcached :D");
    cachedHoge = (String) client.get("hoge");
    System.out.println("cachedHoge is ... " + cachedHoge);

    // オブジェクトを出し入れもできる
    Map<String, Object> fuga = new HashMap<>();
    fuga.put("name", "goodone");
    fuga.put("keyX", Math.random() * 100);
    fuga.put("keyY", Math.random() * 100);
    client.set("fuga", CACHE_EXPIRATION_SEC, fuga);

    @SuppressWarnings("unchecked")
    Map<String, Object> cachedFuga = (Map<String, Object>) client.get("fuga");
    System.out.println("Is cachedHoge exists? ... " + Objects.nonNull(cachedHoge));
    if (Objects.nonNull(cachedHoge)) {
      System.out.println("1st get");
      for (String key : cachedFuga.keySet()) {
        System.out.println(key + " --> " + cachedFuga.get(key));
      }
    }

    // 明示的にJVNプロセスを落とさないと,
    // Memcachedとのコネクションが張られたままプロセスが終了しない!?
    System.exit(0);
  }
}
```
