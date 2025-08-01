import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ThemeProvider } from '@/theme/ThemeProvider';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			networkMode: 'offlineFirst',
		},
	},
});

type AppProviderProps = {
	children: React.ReactNode;
};

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider defaultTheme="light" storageKey="app-theme">
				<DndProvider backend={HTML5Backend}>
					{children}
				</DndProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
};

export default AppProvider;