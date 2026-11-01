export function requestErrorMessage(error:unknown){
 const message=error instanceof Error?error.message:"";
 return error instanceof TypeError||/failed to fetch|networkerror|load failed/i.test(message)?"Không kết nối được máy chủ. Nội dung đang nhập vẫn được giữ; vui lòng thử lại.":message||"Không xử lý được yêu cầu. Vui lòng thử lại.";
}
