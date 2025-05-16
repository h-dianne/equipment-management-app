import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import DetailItem from "../../../components/common/DetailItem";

describe("DetailItemコンポーネント", () => {
  test("ラベルと値が正しくレンダリングされることの確認", () => {
    render(<DetailItem label="備品名" value="Sonyカメラ" />);

    // ラベルと値の両方がレンダリングされていることを確認
    expect(screen.getByText("備品名")).toBeInTheDocument();
    expect(screen.getByText("Sonyカメラ")).toBeInTheDocument();
  });

  test("カスタムclassNameが提供された場合に適用されること", () => {
    const customClass = "border-t pt-4";
    const { container } = render(
      <DetailItem
        label="カテゴリ"
        value="AV機器・周辺機器"
        className={customClass}
      />
    );

    // ルート要素を取得し、カスタムクラスが適用されていることを確認
    const rootElement = container.firstChild as HTMLElement;
    expect(rootElement).toHaveClass(customClass);
    // カスタムクラスがあっても内容が正しくレンダリングされることを確認
    expect(screen.getByText("カテゴリ")).toBeInTheDocument();
    expect(screen.getByText("AV機器・周辺機器")).toBeInTheDocument();
  });

  test("ラベルと値に正しいスタイルが適用されること", () => {
    const { container } = render(<DetailItem label="メーカー" value="SONY" />);

    // dt要素とdd要素を検索し、スタイルクラスを確認
    const labelElement = container.querySelector("dt");
    const valueElement = container.querySelector("dd");

    expect(labelElement).toHaveClass("text-sm");
    expect(labelElement).toHaveClass("font-medium");
    expect(labelElement).toHaveClass("text-gray-500");

    expect(valueElement).toHaveClass("mt-1");
    expect(valueElement).toHaveClass("text-sm");
    expect(valueElement).toHaveClass("text-gray-900");
  });

  test("空の値を適切に処理すること", () => {
    render(<DetailItem label="使用者" value="" />);

    // ラベルがレンダリングされていることを確認
    expect(screen.getByText("使用者")).toBeInTheDocument();

    // 空の値が正しくレンダリングされ、レイアウトが崩れないことを確認
    const valueElement = screen.getByText("使用者")
      .nextElementSibling as HTMLElement;
    expect(valueElement).toBeInTheDocument();
    expect(valueElement.textContent).toBe("");
  });

  test("スナップショットと一致することを確認", () => {
    const { asFragment } = render(
      <DetailItem label="保管場所" value="個人デスク" />
    );

    // コンポーネントのレンダリングが一貫していることを確認
    expect(asFragment()).toMatchSnapshot();
  });
});
