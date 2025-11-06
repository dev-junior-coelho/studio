#!/bin/bash

FILE='/home/juniorcoelho/Área de trabalho/studio/src/seed.ts'

# Fazer backup
cp "$FILE" "$FILE.bak"

# Substituir TV Cabeada (produtos que contêm CTV+ ou começam com INICIAL ou RET ANUNCIO)
# INICIAL HD RET
sed -i 's/tipo: "TV", nome: "INICIAL HD RET ANUNCIO/tipo: "TV Cabeada", nome: "INICIAL HD RET ANUNCIO/g' "$FILE"

# CTV+ (CTV+ TOP HD RET ou CTV+ TOP HD 4K não-RENT)
sed -i 's/tipo: "TV", nome: "CTV+ TOP HD RET/tipo: "TV Cabeada", nome: "CTV+ TOP HD RET/g' "$FILE"
sed -i 's/tipo: "TV", nome: "CTV+ TOP HD 4K SOUND MULTI/tipo: "TV Cabeada", nome: "CTV+ TOP HD 4K SOUND MULTI/g' "$FILE"
sed -i 's/tipo: "TV", nome: "CTV+ TOP HD 4K SOUND"$/tipo: "TV Cabeada", nome: "CTV+ TOP HD 4K SOUND"/g' "$FILE"
sed -i 's/tipo: "TV", nome: "CTV+ TOP HD 4K MULTI/tipo: "TV Cabeada", nome: "CTV+ TOP HD 4K MULTI/g' "$FILE"
sed -i 's/tipo: "TV", nome: "CTV+ TOP HD 4K"$/tipo: "TV Cabeada", nome: "CTV+ TOP HD 4K"/g' "$FILE"

# TV Box (CLARO STREAMING ou CLARO TV BOX)
sed -i 's/tipo: "TV", nome: "CLARO STREAMING/tipo: "TV Box", nome: "CLARO STREAMING/g' "$FILE"
sed -i 's/tipo: "TV", nome: "CLARO TV BOX/tipo: "TV Box", nome: "CLARO TV BOX/g' "$FILE"

# Claro TV APP
sed -i 's/tipo: "TV", nome: "CLARO TV+ APP/tipo: "Claro TV APP", nome: "CLARO TV+ APP/g' "$FILE"
sed -i 's/tipo: "TV", nome: "CLARO TV+ STREAMINGS/tipo: "Claro TV APP", nome: "CLARO TV+ STREAMINGS/g' "$FILE"

# RENT (Rent de CTV+ e SOUNDBOX) - TV Cabeada
sed -i 's/tipo: "TV", nome: "CTV+TOP HD 4K RENT/tipo: "TV Cabeada", nome: "CTV+TOP HD 4K RENT/g' "$FILE"
sed -i 's/tipo: "TV", nome: "CLARO TV+ SOUNDBOX RENT/tipo: "TV Cabeada", nome: "CLARO TV+ SOUNDBOX RENT/g' "$FILE"

echo "✅ Arquivo seed.ts atualizado com sucesso!"
