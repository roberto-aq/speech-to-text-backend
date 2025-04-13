create table
    transcripciones (
        id uuid primary key default gen_random_uuid (),
        user_id uuid references auth.users (id) on delete cascade,
        filename text not null,
        storage_path text not null,
        duration_seconds int, -- duración del audio original (en segundos)
        language text default 'es', -- idioma usado en la transcripción
        created_at timestamp
        with
            time zone default now ()
    );