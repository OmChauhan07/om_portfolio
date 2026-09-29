import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

async function generateResume() {
  const pdfDoc = await PDFDocument.create();
  
  // Standard Letter size: 612 x 792 points
  const page = pdfDoc.addPage([612, 792]);
  const { width, height } = page.getSize();
  
  const fontRegular = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  const primaryColor = rgb(0.08, 0.08, 0.08); // #141414
  const headingColor = rgb(0.05, 0.25, 0.45); // Deep navy for clean accent or black
  const sectionColor = rgb(0.1, 0.1, 0.1);
  const grayColor = rgb(0.3, 0.3, 0.3);
  const ruleColor = rgb(0.7, 0.7, 0.7);

  const leftMargin = 45;
  const rightMargin = width - 45;
  const contentWidth = rightMargin - leftMargin;

  let y = height - 42;

  // Helper functions
  const drawLine = () => {
    y -= 3;
    page.drawLine({
      start: { x: leftMargin, y },
      end: { x: rightMargin, y },
      thickness: 0.75,
      color: ruleColor,
    });
    y -= 10;
  };

  const drawSectionHeader = (title: string) => {
    y -= 6;
    page.drawText(title, {
      x: leftMargin,
      y,
      size: 11.5,
      font: fontBold,
      color: sectionColor,
    });
    drawLine();
  };

  const drawWrappedText = (text: string, x: number, maxWidth: number, font: any, size: number, color = primaryColor, lineHeight = 13.5) => {
    const words = text.split(" ");
    let line = "";
    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, size);
      if (testWidth > maxWidth) {
        page.drawText(line, { x, y, size, font, color });
        y -= lineHeight;
        line = word;
      } else {
        line = testLine;
      }
    }
    if (line) {
      page.drawText(line, { x, y, size, font, color });
      y -= lineHeight;
    }
  };

  const drawBullet = (text: string, maxWidth = contentWidth - 14) => {
    page.drawText("•", { x: leftMargin + 2, y, size: 9, font: fontRegular, color: primaryColor });
    const bulletTextX = leftMargin + 14;
    const words = text.split(" ");
    let line = "";
    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const testWidth = fontRegular.widthOfTextAtSize(testLine, 9.5);
      if (testWidth > maxWidth) {
        page.drawText(line, { x: bulletTextX, y, size: 9.5, font: fontRegular, color: primaryColor });
        y -= 12.5;
        line = word;
      } else {
        line = testLine;
      }
    }
    if (line) {
      page.drawText(line, { x: bulletTextX, y, size: 9.5, font: fontRegular, color: primaryColor });
      y -= 12.5;
    }
  };

  // Name Header
  const nameText = "Om Chauhan";
  const nameWidth = fontBold.widthOfTextAtSize(nameText, 22);
  page.drawText(nameText, {
    x: (width - nameWidth) / 2,
    y,
    size: 22,
    font: fontBold,
    color: primaryColor,
  });
  y -= 16;

  // Contact line
  const contactText = "+91-7359798392   |   odchauhan0702@gmail.com   |   linkedin.com/in/om-chauhan-21043824b";
  const contactWidth = fontRegular.widthOfTextAtSize(contactText, 9);
  page.drawText(contactText, {
    x: (width - contactWidth) / 2,
    y,
    size: 9,
    font: fontRegular,
    color: grayColor,
  });
  y -= 12;

  const contactText2 = "github.com/OmChauhan07   |   Portfolio   |   Mahemdavad, Gujarat, India";
  const contactWidth2 = fontRegular.widthOfTextAtSize(contactText2, 9);
  page.drawText(contactText2, {
    x: (width - contactWidth2) / 2,
    y,
    size: 9,
    font: fontRegular,
    color: grayColor,
  });
  y -= 10;

  // 1. Summary
  drawSectionHeader("Summary");
  drawWrappedText(
    "B.Tech Information Technology student and 3x national hackathon finalist with hands-on experience building full-stack applications, AI-powered systems, and data-driven solutions. Proficient in Python, FastAPI, React, SQL, machine learning, and generative AI, with experience developing production-oriented projects and automated data workflows.",
    leftMargin,
    contentWidth,
    fontRegular,
    9.5,
    primaryColor,
    13.5
  );

  // 2. Technical Skills
  drawSectionHeader("Technical Skills");
  const skills = [
    { label: "Languages:", text: "Python, JavaScript, SQL, HTML5, CSS3" },
    { label: "Frameworks & Web:", text: "React.js, Django, FastAPI, Node.js, Express.js" },
    { label: "AI, ML & Data:", text: "Pandas, NumPy, Scikit-learn, Google GenAI" },
    { label: "Databases & Cloud:", text: "PostgreSQL, MongoDB" },
    { label: "Tools:", text: "Git, GitHub, Jupyter." },
  ];

  for (const s of skills) {
    page.drawText(s.label, { x: leftMargin, y, size: 9.5, font: fontBold, color: primaryColor });
    const labelWidth = fontBold.widthOfTextAtSize(s.label, 9.5);
    page.drawText(s.text, { x: leftMargin + labelWidth + 5, y, size: 9.5, font: fontRegular, color: primaryColor });
    y -= 13.5;
  }

  // 3. Experience
  drawSectionHeader("Experience");

  // Job 1
  page.drawText("Elevance Skills", { x: leftMargin, y, size: 10.5, font: fontBold, color: primaryColor });
  const elevanceWidth = fontBold.widthOfTextAtSize("Elevance Skills", 10.5);
  page.drawText(" | NumPy, Pandas, Matplotlib, Seaborn, Plotly, Streamlit", {
    x: leftMargin + elevanceWidth,
    y,
    size: 9,
    font: fontItalic,
    color: grayColor,
  });
  y -= 13;

  page.drawText("Data Analysis Intern", { x: leftMargin, y, size: 9.5, font: fontItalic, color: primaryColor });
  const date1 = "May 2026 – June 2026";
  const date1Width = fontItalic.widthOfTextAtSize(date1, 9.5);
  page.drawText(date1, { x: rightMargin - date1Width, y, size: 9.5, font: fontItalic, color: grayColor });
  y -= 12;

  drawBullet("Cleaned and analyzed operational data, building Pandas/Streamlit dashboards to visualize trends and surface key insights for the team.");
  y -= 2;

  // Job 2
  page.drawText("Cognifyz Technologies", { x: leftMargin, y, size: 10.5, font: fontBold, color: primaryColor });
  const cognifyzWidth = fontBold.widthOfTextAtSize("Cognifyz Technologies", 10.5);
  page.drawText(" | NumPy, Pandas, Matplotlib, Seaborn, Scikit-learn", {
    x: leftMargin + cognifyzWidth,
    y,
    size: 9,
    font: fontItalic,
    color: grayColor,
  });
  y -= 13;

  page.drawText("Data Science Intern", { x: leftMargin, y, size: 9.5, font: fontItalic, color: primaryColor });
  const date2 = "April 2025 – May 2025";
  const date2Width = fontItalic.widthOfTextAtSize(date2, 9.5);
  page.drawText(date2, { x: rightMargin - date2Width, y, size: 9.5, font: fontItalic, color: grayColor });
  y -= 12;

  drawBullet("Cleaned and preprocessed large-scale datasets, engineered features, and trained/cross-validated predictive models in Scikit-learn, achieving 85% accuracy.");

  // 4. Projects
  drawSectionHeader("Projects");

  // Project 1
  page.drawText("DocuMind", { x: leftMargin, y, size: 10.5, font: fontBold, color: primaryColor });
  const docuWidth = fontBold.widthOfTextAtSize("DocuMind", 10.5);
  page.drawText(" | React, FastAPI, CrewAI, GenAI", {
    x: leftMargin + docuWidth,
    y,
    size: 9,
    font: fontItalic,
    color: grayColor,
  });
  const docuDate = "June 2026 – Present";
  const docuDateWidth = fontItalic.widthOfTextAtSize(docuDate, 9.5);
  page.drawText(docuDate, { x: rightMargin - docuDateWidth, y, size: 9.5, font: fontItalic, color: grayColor });
  y -= 12;

  drawBullet("Built a 2-agent AI pipeline using CrewAI and Google Gemini for automated document analysis and structured report generation.");
  drawBullet("Designed a Django + FastAPI architecture with PostgreSQL/pgvector, object storage, asynchronous processing.");
  y -= 2;

  // Project 2
  page.drawText("DAO Browser", { x: leftMargin, y, size: 10.5, font: fontBold, color: primaryColor });
  const daoWidth = fontBold.widthOfTextAtSize("DAO Browser", 10.5);
  page.drawText(" | Chromium, Electron, Flask, NLTK", {
    x: leftMargin + daoWidth,
    y,
    size: 9,
    font: fontItalic,
    color: grayColor,
  });
  const daoDate = "Feb 2026 – May 2026";
  const daoDateWidth = fontItalic.widthOfTextAtSize(daoDate, 9.5);
  page.drawText(daoDate, { x: rightMargin - daoDateWidth, y, size: 9.5, font: fontItalic, color: grayColor });
  y -= 12;

  drawBullet("Built a Chromium-based desktop browser with an AI-powered article summarizer (Flask, NLTK/Sumy LSA).");
  drawBullet("Implemented privacy features (ad/tracker/NSFW blocking) along with Focus Mode and Exam Mode lockdown systems.");

  // 5. Education
  drawSectionHeader("Education");

  // Edu 1
  page.drawText("Charotar University of Science and Technology (CHARUSAT)", {
    x: leftMargin,
    y,
    size: 10,
    font: fontBold,
    color: primaryColor,
  });
  const eduLoc1 = "Anand, Gujarat";
  const eduLoc1Width = fontItalic.widthOfTextAtSize(eduLoc1, 9.5);
  page.drawText(eduLoc1, { x: rightMargin - eduLoc1Width, y, size: 9.5, font: fontItalic, color: grayColor });
  y -= 12;

  page.drawText("Bachelor of Technology in Information Technology (CGPA: 7.14/10.00)", {
    x: leftMargin,
    y,
    size: 9.5,
    font: fontItalic,
    color: primaryColor,
  });
  const eduDate1 = "July 2024 – Present";
  const eduDate1Width = fontItalic.widthOfTextAtSize(eduDate1, 9.5);
  page.drawText(eduDate1, { x: rightMargin - eduDate1Width, y, size: 9.5, font: fontItalic, color: grayColor });
  y -= 14;

  // Edu 2
  page.drawText("D A Degree Engineering and Technology (GTU)", {
    x: leftMargin,
    y,
    size: 10,
    font: fontBold,
    color: primaryColor,
  });
  const eduLoc2 = "Mahemdavad, Gujarat";
  const eduLoc2Width = fontItalic.widthOfTextAtSize(eduLoc2, 9.5);
  page.drawText(eduLoc2, { x: rightMargin - eduLoc2Width, y, size: 9.5, font: fontItalic, color: grayColor });
  y -= 12;

  page.drawText("Diploma in Computer Engineering (CGPA: 8.00/10.00)", {
    x: leftMargin,
    y,
    size: 9.5,
    font: fontItalic,
    color: primaryColor,
  });
  const eduDate2 = "May 2021 – June 2024";
  const eduDate2Width = fontItalic.widthOfTextAtSize(eduDate2, 9.5);
  page.drawText(eduDate2, { x: rightMargin - eduDate2Width, y, size: 9.5, font: fontItalic, color: grayColor });

  // 6. Achievements & Certifications
  drawSectionHeader("Achievements & Certifications");
  drawBullet("National Hackathon Finalist (3x): Reached the national finals at Odoo x SPIT (Dec 2025), Odoo x CGC Mohali (Aug 2025), and Odoo x GVP (Mar 2025).");
  drawBullet("FreeCodeCamp Python Certification: Demonstrated proficiency in Python programming, problem solving, data structures, and algorithmic concepts through freeCodeCamp’s Python curriculum.");
  drawBullet("IBM Machine Learning Professional Certificate: Applied ML algorithms, data preprocessing, and predictive modeling.");
  drawBullet("AWS Cloud Development Certification: Cloud computing fundamentals and application deployment.");

  // Save PDF
  const pdfBytes = await pdfDoc.save();

  // Ensure directories exist
  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outPath1 = path.join(publicDir, "Om_Chauhan_Resume.pdf");
  const outPath2 = path.join(publicDir, "resume.pdf");

  fs.writeFileSync(outPath1, pdfBytes);
  fs.writeFileSync(outPath2, pdfBytes);

  console.log("Successfully generated PDF at:", outPath1, outPath2);
}

generateResume().catch((err) => {
  console.error("Error generating resume PDF:", err);
  process.exit(1);
});
