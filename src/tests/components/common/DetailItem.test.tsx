import { render, screen } from "@testing-library/react";
import { describe, test as it, expect } from "vitest";
import DetailItem from "../../../components/common/DetailItem";

describe("DetailItemコンポーネント", () => {
  it("ラベルと値が正しくレンダリングされることの確認", () => {
    const item = {
      label: "備品名",
      value: "Sonyカメラ"
    };
    render(<DetailItem label={item.label} value={item.value} />);

    // ラベルと値の両方がレンダリングされていることを確認
    expect(screen.getByText("備品名")).toBeInTheDocument();
    expect(screen.getByText("Sonyカメラ")).toBeInTheDocument();
  });

  it("空の値を適切に処理することの確認", () => {
    render(<DetailItem label="使用者" value="" />);

    // ラベルがレンダリングされていることを確認
    expect(screen.getByText("使用者")).toBeInTheDocument();

    // 空の値が正しくレンダリングされ、レイアウトが崩れないことを確認
    const valueElement = screen.getByText("使用者")
      .nextElementSibling as HTMLElement;
    expect(valueElement).toBeInTheDocument();
    expect(valueElement.textContent).toBe("");
  });

  it("スナップショットと一致することを確認", () => {
    const { asFragment } = render(
      <DetailItem label="保管場所" value="個人デスク" />
    );

    // コンポーネントのレンダリングが一貫していることを確認
    expect(asFragment()).toMatchSnapshot();
  });
});
