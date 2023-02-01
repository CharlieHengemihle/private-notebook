import { render, screen } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { NoteProvider } from './context/NoteContext';
import App from './App';

const mockNotes = [
  { id: 1, title: 'Our happy note!', content: 'Happy times' },
  { id: 2, title: 'Another happy lil note', content: 'Hello!' },
];

jest.mock('./context/UserContext.jsx');

const getNoteByIdRoute = rest.get(
  'https://ezwbsacoojmonmiqffad.supabase.co/rest/v1/notes',
  (req, res, ctx) => {
    return res(ctx.json(mockNotes));
  }
);

const server = setupServer(getNoteByIdRoute);

describe('Private Notebook', () => {
  beforeAll(() => {
    // start our mock server to intercept the requests we have handlers for
    server.listen();
  });

  afterAll(() => {
    // shut down our server after running all the tests in this file
    server.close();
  });

  it('should show a note list view', async () => {
    render(
      <UserProvider mockUser={{ id: 1, email: 'test.user@example.com' }}>
        <NoteProvider>
          {/* initialEntries navigates our test to the specified page */}
          <MemoryRouter initialEntries={['/notes']}>
            <App />
          </MemoryRouter>
        </NoteProvider>
      </UserProvider>
    );

    await screen.findByText(/Our happy note!/i);
    await screen.findByText(/Another happy lil note/i);
  });

  it('should show a note detail view', async () => {
    render(
      <UserProvider mockUser={{ id: 1, email: 'test.user@example.com' }}>
        <NoteProvider>
          {/* initialEntries navigates our test to the specified page */}
          <MemoryRouter initialEntries={['/notes/1']}>
            <App />
          </MemoryRouter>
        </NoteProvider>
      </UserProvider>
    );

    await screen.findByText(/Happy times/i);
  });
});
