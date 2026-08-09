const db = require('../config/db');

//    취약 포인트: 블랙리스트로 위험 문자를 걸러내려고 시도는 하지만,
//    필터링된 결과(sanitized)를 실제 쿼리에는 반영하지 않고 원본(raw)을 그대로 사용함
//    (코드 리뷰 없이 급하게 짤 때 실제로 자주 나오는 실수 패턴)
//    + 설령 sanitized를 썼더라도 대소문자 구분 필터라 "or", "Or" 등은 그대로 통과됨
function vulnSearch(req, res) {
  const raw = req.query.q || '';

  let sanitized = raw;
  const blacklist = ["'", 'OR', '--'];
  for (const word of blacklist) {
    sanitized = sanitized.split(word).join('');
  }
  void sanitized; // 필터링 결과를 만들어놓고 실제로는 사용하지 않음

  const sql = `SELECT * FROM products WHERE name LIKE '%${raw}%'`;

  try {
    const rows = db.prepare(sql).all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: '검색 중 오류가 발생했습니다.' });
  }
}

module.exports = { vulnSearch };

