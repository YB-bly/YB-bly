const MAX_IMAGE_BYTES = 1_500_000;

const ALLOWED_TYPES = {
  'image/jpeg': (buffer) =>
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff,

  'image/png': (buffer) =>
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a,

  'image/gif': (buffer) =>
    buffer.length >= 6 &&
    buffer.slice(0, 3).toString('ascii') === 'GIF' &&
    ['87a', '89a'].includes(buffer.slice(3, 6).toString('ascii')),

  'image/webp': (buffer) =>
    buffer.length >= 12 &&
    buffer.slice(0, 4).toString('ascii') === 'RIFF' &&
    buffer.slice(8, 12).toString('ascii') === 'WEBP',
};

const DATA_URL_PATTERN =
  /^data:(image\/(?:jpeg|png|gif|webp));base64,([A-Za-z0-9+/]+={0,2})$/;

/**
 * @param {string} imageUrl
 * @returns {{ ok: true } | { ok: false, error: string }}
 */
function validateProductImage(imageUrl) {
  if (!imageUrl) {
    return { ok: true };
  }

  const match = DATA_URL_PATTERN.exec(imageUrl);
  if (!match) {
    return {
      ok: false,
      error: '이미지 형식이 올바르지 않습니다. jpg, png, gif, webp만 업로드할 수 있습니다.',
    };
  }

  const [, mimeType, base64Data] = match;

  let buffer;
  try {
    buffer = Buffer.from(base64Data, 'base64');
  } catch (err) {
    return { ok: false, error: '이미지 데이터를 읽을 수 없습니다.' };
  }

  if (buffer.length === 0) {
    return { ok: false, error: '이미지 데이터가 비어있습니다.' };
  }

  if (buffer.length > MAX_IMAGE_BYTES) {
    return {
      ok: false,
      error: '이미지는 1.5MB 이하만 업로드할 수 있습니다.',
    };
  }

  const signatureCheck = ALLOWED_TYPES[mimeType];
  if (!signatureCheck || !signatureCheck(buffer)) {
    return {
      ok: false,
      error: '파일 내용이 선언된 이미지 형식과 일치하지 않습니다.',
    };
  }

  return { ok: true };
}

module.exports = { validateProductImage, MAX_IMAGE_BYTES };
