import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NoteProvider } from '../../context/NoteContext';
import { UserProvider } from '../../context/UserContext';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import Breadcrumbs from './Breadcrumbs';

const getNoteRoute = rest.get(
  'https://ezwbsacoojmonmiqffad.supabase.co/rest/v1/notes',
  (req, res, ctx) => {
    return res(ctx.json([{ id: 1, title: 'Test Note from MSW!' }]));
  }
);

// const createNoteRoute = rest.post(
//   'https://ezwbsacoojmonmiqffad.supabase.co/rest/v1/notes',
//   (req, res, ctx) => {
//     const { title, content } = req.body;
//     return res(ctx.json({ id: 1, title, content }));
//   }
// );

// const deleteNoteRoute = rest.delete(
//   'https://ezwbsacoojmonmiqffad.supabase.co/rest/v1/notes',
//   (req, res, ctx) => {
//     const { title, content } = req.body;
//     return res(ctx.json({ data: { id: 1, title, content } }));
//   }
// );

const server = setupServer(getNoteRoute);

jest.mock('../../context/UserContext');

describe('Breadcrumbs', () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  it('should display a link to the Notebook by default', async () => {
    const { container } = render(
      <UserProvider>
        <NoteProvider>
          <MemoryRouter>
            <Breadcrumbs />
          </MemoryRouter>
        </NoteProvider>
      </UserProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it('should display the current note’s title when viewing a note', async () => {
    const { container } = render(
      <UserProvider mockUser={{ id: 1, email: 'test@example.com' }}>
        <NoteProvider>
          <MemoryRouter initialEntries={['/notes/1']}>
            <Breadcrumbs />
          </MemoryRouter>
        </NoteProvider>
      </UserProvider>
    );

    await screen.findByText(/Test Note from MSW!/);
    expect(container).toMatchSnapshot();
  });

  it('should display "Edit" when editing a note', async () => {
    const { container } = render(
      <UserProvider mockUser={{ id: 1, email: 'test@example.com' }}>
        <NoteProvider>
          <MemoryRouter initialEntries={['/notes/1/edit']}>
            <Breadcrumbs />
          </MemoryRouter>
        </NoteProvider>
      </UserProvider>
    );

    await screen.findByText(/Edit/);
    expect(container).toMatchSnapshot();
  });
});
