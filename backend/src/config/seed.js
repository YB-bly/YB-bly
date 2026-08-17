// 초기 테스트 데이터를 넣는 스크립트.
// npm run seed 로 실행하세요.

const bcrypt = require('bcrypt');
const db = require('./db');

async function seed() {
  const adminPassword = await bcrypt.hash(
    'admin1234',
    10
  );

  const userPassword = await bcrypt.hash(
    'user1234',
    10
  );

  // -------------------------------------------------------
  // 기본 사용자
  // -------------------------------------------------------

  db.prepare(
    `INSERT OR IGNORE INTO users
     (email, password, name, role)
     VALUES (?, ?, ?, ?)`
  ).run(
    'admin@ybbly.com',
    adminPassword,
    '관리자',
    'admin'
  );

  db.prepare(
    `INSERT OR IGNORE INTO users
     (email, password, name, role)
     VALUES (?, ?, ?, ?)`
  ).run(
    'user@ybbly.com',
    userPassword,
    '테스트유저',
    'user'
  );

  // 리뷰 작성용 기본 사용자
  const reviewUsers = [
    [
      'review1@ybbly.com',
      '융보카리나',
    ],
    [
      'review2@ybbly.com',
      '융보윈터',
    ],
    [
      'review3@ybbly.com',
      '융보닝닝',
    ],
    [
      'review4@ybbly.com',
      '융보지젤',
    ],
    [
      'review5@ybbly.com',
      '융보박보영',
    ],
    [
      'review6@ybbly.com',
      '융보아이린',
    ],
    [
      'review7@ybbly.com',
      '융보예리',
    ],
    [
      'review8@ybbly.com',
      '융보백지헌',
    ],
  ];

  const insertReviewUser =
    db.prepare(
      `INSERT OR IGNORE INTO users
       (email, password, name, role)
       VALUES (?, ?, ?, ?)`
    );

  for (
    const [
      email,
      name,
    ] of reviewUsers
  ) {
    insertReviewUser.run(
      email,
      userPassword,
      name,
      'user'
    );
  }

  const seededReviewUsers =
    db.prepare(
      `SELECT id, email, name
       FROM users
       WHERE email IN (
         'review1@ybbly.com',
         'review2@ybbly.com',
         'review3@ybbly.com',
         'review4@ybbly.com',
         'review5@ybbly.com',
         'review6@ybbly.com',
         'review7@ybbly.com',
         'review8@ybbly.com'
       )
       ORDER BY email ASC`
    ).all();
  // -------------------------------------------------------
  // 기존 테스트유저 리뷰 작성자 변경
  // -------------------------------------------------------

  const testUser = db
    .prepare(
      `SELECT id
     FROM users
     WHERE email = ?`
    )
    .get('user@ybbly.com');

  if (testUser) {
    const oldTestReviews = db
      .prepare(
        `SELECT id
       FROM reviews
       WHERE user_id = ?
       ORDER BY id ASC`
      )
      .all(testUser.id);

    const updateReviewUser = db.prepare(
      `UPDATE reviews
     SET user_id = ?
     WHERE id = ?`
    );

    oldTestReviews.forEach(
      (review, index) => {
        const reviewUser =
          seededReviewUsers[
          index %
          seededReviewUsers.length
          ];

        updateReviewUser.run(
          reviewUser.id,
          review.id
        );
      }
    );
  }

  // -------------------------------------------------------
  // 기본 상품
  // -------------------------------------------------------

  const products = [
    [
      '(최단일) 미엘 클라라 블라우스 원피스',
      '융보와요',
      44650,
      55813,
      20,
      '빠른출고',
      '원피스/세트',
      '부드러운 촉감과 여유로운 실루엣의 원피스입니다.',
      '',
      34,
    ],
    [
      '[여름바지/3기장선택] 와이드 밴딩 팬츠',
      '융로우먼트',
      26520,
      54122,
      51,
      '오늘출발',
      '팬츠/스커트',
      '편안한 밴딩 처리의 와이드 팬츠입니다.',
      '',
      12,
    ],
    [
      '여름 찰랑 와우 감탄사 절로나와 셔츠',
      '융프라와우',
      49900,
      77969,
      36,
      '빠른배송',
      '상의',
      '시원한 소재의 여름 셔츠입니다.',
      '',
      0,
    ],
    [
      '여름 시스루 루즈핏 체크 셔츠',
      '융어데이',
      32800,
      40000,
      18,
      '단독상품',
      '아우터',
      '루즈핏 실루엣의 체크 셔츠입니다.',
      '',
      8,
    ],
    [
      '하늘하늘 날아갈지도 몰라 블라우스',
      '융티랩',
      39900,
      57000,
      30,
      '하루특가',
      '상의',
      '가볍게 걸치기 좋은 블라우스입니다.',
      '',
      21,
    ],
    [
      '시원한 여름 청바지 이거야 이거',
      '융랙무드',
      29900,
      39867,
      25,
      '빠른출고',
      '팬츠/스커트',
      '시원한 여름용 청바지입니다.',
      '',
      5,
    ],
  ];

  const insertProduct =
    db.prepare(
      `INSERT INTO products
      (
        name,
        brand,
        price,
        original_price,
        discount_percent,
        badge,
        category,
        description,
        image_url,
        stock
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

  const productIds = [];

  for (const product of products) {
    /*
     * 같은 이름의 상품이 이미 있으면
     * 새로 추가하지 않고 기존 id 사용
     */
    const existingProduct =
      db.prepare(
        `SELECT id
         FROM products
         WHERE name = ?
         LIMIT 1`
      ).get(product[0]);

    if (existingProduct) {
      productIds.push(
        existingProduct.id
      );

      continue;
    }

    const result =
      insertProduct.run(
        ...product
      );

    productIds.push(
      Number(
        result.lastInsertRowid
      )
    );
  }

  // -------------------------------------------------------
  // 기본 리뷰
  // -------------------------------------------------------

  /*
   * 상품별 리뷰 개수를 일부러 다르게 설정해서
   * "리뷰 많은순" 정렬이 눈에 보이도록 한다.
   *
   * 상품 1 : 5개
   * 상품 2 : 2개
   * 상품 3 : 8개
   * 상품 4 : 1개
   * 상품 5 : 4개
   * 상품 6 : 3개
   */

  const reviewSeeds = [
    {
      productIndex: 0,
      reviews: [
        [
          '핏이 예쁘고 편해요.',
          5,
        ],
        [
          '사진이랑 거의 똑같아요.',
          5,
        ],
        [
          '원단이 부드러워서 좋아요.',
          4,
        ],
        [
          '여름에 입기 좋을 것 같아요.',
          5,
        ],
        [
          '배송도 빠르고 만족해요.',
          5,
        ],
      ],
    },

    {
      productIndex: 1,
      reviews: [
        [
          '허리가 편해서 좋아요.',
          5,
        ],
        [
          '기장이 조금 길지만 예뻐요.',
          4,
        ],
      ],
    },

    {
      productIndex: 2,
      reviews: [
        [
          '소재가 정말 시원해요.',
          5,
        ],
        [
          '핏이 마음에 들어요.',
          5,
        ],
        [
          '색감이 예뻐요.',
          4,
        ],
        [
          '여름에 자주 입을 것 같아요.',
          5,
        ],
        [
          '가격 대비 만족합니다.',
          4,
        ],
        [
          '생각보다 얇아서 좋아요.',
          5,
        ],
        [
          '배송이 빨랐어요.',
          5,
        ],
        [
          '재구매하고 싶어요.',
          4,
        ],
      ],
    },

    {
      productIndex: 3,
      reviews: [
        [
          '체크 패턴이 예뻐요.',
          4,
        ],
      ],
    },

    {
      productIndex: 4,
      reviews: [
        [
          '가볍고 편합니다.',
          5,
        ],
        [
          '색상이 마음에 들어요.',
          4,
        ],
        [
          '핏이 여유로워요.',
          4,
        ],
        [
          '봄여름에 잘 입을 것 같아요.',
          5,
        ],
      ],
    },

    {
      productIndex: 5,
      reviews: [
        [
          '청바지인데 시원해서 좋아요.',
          5,
        ],
        [
          '핏이 깔끔합니다.',
          4,
        ],
        [
          '가격도 괜찮고 만족해요.',
          5,
        ],
      ],
    },
  ];

  const insertReview =
    db.prepare(
      `INSERT INTO reviews
      (
        user_id,
        product_id,
        content,
        rating
      )
      SELECT ?, ?, ?, ?
      WHERE NOT EXISTS (
        SELECT 1
        FROM reviews
        WHERE user_id = ?
          AND product_id = ?
          AND content = ?
      )`
    );

  let reviewUserIndex = 0;

  for (const seed of reviewSeeds) {
    const productId =
      productIds[
      seed.productIndex
      ];

    for (
      const [
        content,
        rating,
      ] of seed.reviews
    ) {
      const reviewUser =
        seededReviewUsers[
        reviewUserIndex %
        seededReviewUsers.length
        ];

      insertReview.run(
        reviewUser.id,
        productId,
        content,
        rating,

        reviewUser.id,
        productId,
        content
      );

      reviewUserIndex += 1;
    }
  }

  // -------------------------------------------------------
  // 기본 쿠폰
  // -------------------------------------------------------

  db.prepare(
    `INSERT OR IGNORE INTO coupons
     (code, label, discount_percent, min_order_amount, expires_at)
     VALUES (?, ?, ?, ?, ?)`
  ).run(
    'WELCOME10',
    '첫 구매 10% 할인',
    10,
    0,
    '2026.12.31'
  );

  db.prepare(
    `INSERT OR IGNORE INTO coupons
     (code, label, discount_percent, min_order_amount, expires_at)
     VALUES (?, ?, ?, ?, ?)`
  ).run(
    'ONCE20',
    '1회 한정 20% 할인',
    20,
    100000,
    '2026.09.30'
  );

  db.prepare(
    `INSERT OR IGNORE INTO coupons
     (code, label, discount_percent, min_order_amount, expires_at)
     VALUES (?, ?, ?, ?, ?)`
  ).run(
    'SUMMER15',
    '여름 상품 15% 할인',
    15,
    0,
    '2026.08.31'
  );

  // -------------------------------------------------------
  // 완료 로그
  // -------------------------------------------------------

  console.log(
    '시드 데이터 생성 완료'
  );

  console.log(
    '관리자 계정: admin@ybbly.com / admin1234'
  );

  console.log(
    '일반 계정: user@ybbly.com / user1234'
  );

  console.log(
    '기본 리뷰 사용자 생성 완료'
  );

  console.log(
    '기본 리뷰 데이터 생성 완료'
  );

  console.log(
    '쿠폰 코드: WELCOME10 / ONCE20(10만원 이상) / SUMMER15'
  );
}

seed();