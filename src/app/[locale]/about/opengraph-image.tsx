import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "About UniCare - Our Vision";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: { locale: string } }) {
  const isAr = params.locale === "ar";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: isAr ? "flex-end" : "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#FAF9F5",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Organic Background Shapes */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(81,117,101,0.15) 0%, rgba(81,117,101,0) 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "-10%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(106,144,127,0.1) 0%, rgba(106,144,127,0) 70%)",
            display: "flex",
          }}
        />

        {/* Header: Logo and Label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexDirection: isAr ? "row-reverse" : "row",
          }}
        >
          {/* Logo Icon */}
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              backgroundColor: "#517565",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "white", fontWeight: "bold", fontSize: "20px" }}>U</span>
          </div>
          <span style={{ fontSize: "24px", fontWeight: "bold", color: "#131615", letterSpacing: "1px" }}>
            UNICARE
          </span>
        </div>

        {/* Content Block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            width: "85%",
            alignItems: isAr ? "flex-end" : "flex-start",
            textAlign: isAr ? "right" : "left",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "flex",
              padding: "6px 16px",
              borderRadius: "20px",
              backgroundColor: "rgba(81,117,101,0.1)",
              color: "#345144",
              fontSize: "14px",
              fontWeight: "bold",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            {isAr ? "رؤيتنا ورسالتنا" : "OUR VISION & MISSION"}
          </div>

          {/* Hero Title */}
          <h1
            style={{
              fontSize: "52px",
              fontWeight: 800,
              color: "#131615",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {isAr ? "تمكين الطلاب من خلال الموارد المشتركة" : "Empowering Students Through Shared Resources"}
          </h1>

          {/* Hero Description */}
          <p
            style={{
              fontSize: "20px",
              color: "#4B5563",
              margin: 0,
              lineHeight: 1.5,
              fontWeight: 300,
            }}
          >
            {isAr
              ? "نربط الطلاب عبر جميع التخصصات والكليات، لتسهيل استعارة وإعارة وشراء وبيع المستلزمات الدراسية."
              : "We connect students across all majors and faculties, making it seamless to borrow, lend, buy, or sell equipment."}
          </p>
        </div>

        {/* Footer info */}
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(81,117,101,0.1)",
            paddingTop: "24px",
            flexDirection: isAr ? "row-reverse" : "row",
          }}
        >
          <span style={{ fontSize: "14px", color: "#6B7280", textTransform: "uppercase", letterSpacing: "1.5px" }}>
            {isAr ? "تأثير مجتمعي حقيقي" : "Real Student Impact"}
          </span>
          <span style={{ fontSize: "14px", color: "#9CA3AF" }}>
            uni-care-front.vercel.app/about
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
