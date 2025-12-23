
import { ApiResponse } from '../types';

const BASE_URL = 'https://www.travel.taipei/open-api';
// 使用 corsproxy.io，它比 allorigins 更快且不需額外解析 JSON 包裹層
const PROXY_PREFIX = 'https://corsproxy.io/?';

/**
 * 獲取台北市景點資料
 * 修正：嚴格匹配使用者提供的 cURL 格式，並透過代理繞過 CORS 限制。
 */
export const fetchAttractions = async (lang: string = 'zh-tw', page: number = 1): Promise<ApiResponse> => {
  const cleanLang = lang.trim().toLowerCase();
  const targetUrl = `${BASE_URL}/${cleanLang}/Attractions/All?page=${page}`;
  
  // 在瀏覽器環境中，直接請求政府 API 通常會觸發 CORS 錯誤
  // 因此我們直接優先使用代理或在失敗時快速切換
  const tryFetch = async (url: string, useProxy: boolean = false): Promise<ApiResponse> => {
    const finalUrl = useProxy ? `${PROXY_PREFIX}${encodeURIComponent(url)}` : url;
    
    const response = await fetch(finalUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json' // 嚴格遵循 cURL 中的標頭
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await response.json();
    
    // 台北 API 的成功回應應包含 data 陣列
    if (!result || !Array.isArray(result.data)) {
      throw new Error('回傳資料格式不正確');
    }

    return result as ApiResponse;
  };

  try {
    // 優先嘗試直接請求 (某些環境下可能可行)
    return await tryFetch(targetUrl, false);
  } catch (error: any) {
    console.warn('直接連線失敗，啟動 CORS 代理補償機制...', error.message);
    try {
      // 失敗時自動使用代理伺服器
      return await tryFetch(targetUrl, true);
    } catch (proxyError: any) {
      console.error('代理連線亦失敗:', proxyError.message);
      throw new Error('無法取得台北旅遊網資料。這通常是 API 伺服器繁忙或連線受阻，請稍後再試。');
    }
  }
};
