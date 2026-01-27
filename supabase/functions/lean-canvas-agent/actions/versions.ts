/**
 * Version History Actions
 * Save, load, and restore canvas versions
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

interface VersionRecord {
  id: string;
  version_number: number;
  label: string | null;
  created_at: string;
  metadata: Record<string, unknown>;
}

/**
 * Save a version snapshot of the current canvas
 */
export async function saveVersion(
  supabase: SupabaseClient,
  userId: string,
  documentId: string,
  label?: string
): Promise<{ success: boolean; version: VersionRecord | null; error?: string }> {
  console.log(`[saveVersion] Saving version for document ${documentId}`);

  // Get current document
  const { data: doc, error: docError } = await supabase
    .from("documents")
    .select("content_json, metadata")
    .eq("id", documentId)
    .single();

  if (docError || !doc) {
    return { success: false, version: null, error: "Document not found" };
  }

  // Insert new version (version_number is auto-incremented by trigger)
  const { data: version, error: versionError } = await supabase
    .from("document_versions")
    .insert({
      document_id: documentId,
      content_json: doc.content_json,
      metadata: {
        ...doc.metadata,
        snapshot_at: new Date().toISOString(),
      },
      label: label || null,
      created_by: userId,
    })
    .select()
    .single();

  if (versionError) {
    console.error("[saveVersion] Error:", versionError);
    return { success: false, version: null, error: versionError.message };
  }

  return { success: true, version };
}

/**
 * Load all versions for a document
 */
export async function loadVersions(
  supabase: SupabaseClient,
  userId: string,
  documentId: string
): Promise<{ versions: VersionRecord[]; count: number }> {
  console.log(`[loadVersions] Loading versions for document ${documentId}`);

  const { data: versions, error } = await supabase
    .from("document_versions")
    .select("id, version_number, label, created_at, metadata")
    .eq("document_id", documentId)
    .order("version_number", { ascending: false })
    .limit(50);

  if (error) {
    console.error("[loadVersions] Error:", error);
    return { versions: [], count: 0 };
  }

  return {
    versions: versions || [],
    count: versions?.length || 0,
  };
}

/**
 * Restore a previous version (saves current as new version first)
 */
export async function restoreVersion(
  supabase: SupabaseClient,
  userId: string,
  documentId: string,
  versionId: string
): Promise<{ success: boolean; newVersion: VersionRecord | null; error?: string }> {
  console.log(`[restoreVersion] Restoring version ${versionId} for document ${documentId}`);

  // First, save current state as a new version
  const saveResult = await saveVersion(supabase, userId, documentId, "Auto-saved before restore");
  if (!saveResult.success) {
    return { success: false, newVersion: null, error: "Failed to save current version" };
  }

  // Get the version to restore
  const { data: oldVersion, error: fetchError } = await supabase
    .from("document_versions")
    .select("content_json, metadata")
    .eq("id", versionId)
    .single();

  if (fetchError || !oldVersion) {
    return { success: false, newVersion: null, error: "Version not found" };
  }

  // Update the document with the old version's content
  const { error: updateError } = await supabase
    .from("documents")
    .update({
      content_json: oldVersion.content_json,
      metadata: {
        ...oldVersion.metadata,
        restored_from_version: versionId,
        restored_at: new Date().toISOString(),
      },
      updated_at: new Date().toISOString(),
    })
    .eq("id", documentId);

  if (updateError) {
    console.error("[restoreVersion] Error updating document:", updateError);
    return { success: false, newVersion: null, error: updateError.message };
  }

  return { success: true, newVersion: saveResult.version };
}
