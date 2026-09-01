import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

/* Code taken from  https://github.com/TkDodo/testing-react-query/blob/main/src/tests/utils.tsx */
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

/**
 * Wrap components to be rendered for tests with QueryClient and routing capabilities.
 * @param ui Component to be rendered for tests
 * @returns A customized wrapper component that includes QueryClient and Router that prepares components to be rendered for tests
 */
export const renderForTests = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  const { rerender, ...result } = render(
    <QueryClientProvider client={testQueryClient}>
      <Router>{ui}</Router>
    </QueryClientProvider>,
  );
  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(
        <QueryClientProvider client={testQueryClient}>
          <Router>{rerenderUi}</Router>
        </QueryClientProvider>,
      ),
  };
};
