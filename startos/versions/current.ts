import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.48.0:1',
  releaseNotes: {
    en_US:
      'Hotfix: fixed ownership of the local-storage volume. In 2.48.0:0 the StartOS-mounted volume was root-owned while the server runs as uid 1000, so workspace creation and any file upload failed with EACCES after an otherwise healthy boot. A chown-storage oneshot now guarantees ownership before server and worker start. Existing data (accounts, database) is untouched by the update.',
    es_ES:
      'Corrección urgente: se corrigió la propiedad del volumen local-storage. En 2.48.0:0 el volumen montado por StartOS quedaba como root mientras el servidor corre como uid 1000, por lo que la creación del workspace y cualquier subida de archivos fallaban con EACCES tras un arranque aparentemente correcto. Un oneshot chown-storage ahora garantiza la propiedad antes de iniciar el servidor y el worker. Los datos existentes (cuentas, base de datos) no se ven afectados por la actualización.',
    de_DE:
      'Hotfix: Eigentümerschaft des local-storage-Volumes korrigiert. In 2.48.0:0 war das von StartOS eingehängte Volume root-zugeordnet, während der Server als uid 1000 läuft – Workspace-Erstellung und jeder Datei-Upload schlugen daher nach scheinbar gesundem Start mit EACCES fehl. Ein chown-storage-Oneshot stellt die Eigentümerschaft nun sicher, bevor Server und Worker starten. Bestehende Daten (Konten, Datenbank) bleiben vom Update unberührt.',
    pl_PL:
      'Poprawka krytyczna: naprawiono właściciela wolumenu local-storage. W 2.48.0:0 wolumen montowany przez StartOS należał do root, podczas gdy serwer działa jako uid 1000, więc tworzenie workspace i wszelkie uploady kończyły się błędem EACCES mimo pozornie zdrowego startu. Oneshot chown-storage gwarantuje teraz właściwą własność przed startem serwera i workera. Istniejące dane (konta, baza danych) nie są naruszane przez aktualizację.',
    fr_FR:
      "Correctif urgent : propriété du volume local-storage corrigée. Dans 2.48.0:0, le volume monté par StartOS appartenait à root alors que le serveur s'exécute en uid 1000 — la création d'espace de travail et tout envoi de fichier échouaient donc avec EACCES après un démarrage en apparence sain. Un oneshot chown-storage garantit désormais la propriété avant le démarrage du serveur et du worker. Les données existantes (comptes, base de données) ne sont pas touchées par la mise à jour.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
