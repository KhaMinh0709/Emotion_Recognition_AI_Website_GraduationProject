import React from "react";

type State = { hasError: boolean; msg?: string };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(err: any) {
    return { hasError: true, msg: err?.message || String(err) };
  }
  componentDidCatch(error: any, info: any) {
    // log console để bạn nhìn trong DevTools
    console.error("UI crashed:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position:"fixed", inset:0, background:"#0b0b0b", color:"#fff",
          display:"grid", placeItems:"center", padding:24, fontFamily:"ui-sans-serif, system-ui"
        }}>
          <div style={{maxWidth:720}}>
            <h1 style={{fontSize:22, fontWeight:700, marginBottom:8}}>Ứng dụng gặp lỗi</h1>
            <p style={{opacity:.8, whiteSpace:"pre-wrap"}}>{this.state.msg || "Xem console để biết thêm chi tiết."}</p>
            <p style={{opacity:.6, marginTop:8}}>Mở DevTools → Console để xem stacktrace.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
