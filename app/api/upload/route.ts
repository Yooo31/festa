import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'Aucun fichier trouvé.' }, { status: 400 });
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name.replace(/ /g, '_')}`;
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

    await writeFile(filePath, buffer);

    return NextResponse.json({ filename }, { status: 200 });
  } catch (error) {
    console.error('Erreur d’upload:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde du fichier.' },
      { status: 500 },
    );
  }
}
