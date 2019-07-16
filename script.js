Vue.filter('date', time => moment(time).format('DD/MM/YY, HH:mm'));

new Vue({
    el: '#notebook',
    data() {
        return {
            notes: JSON.parse(localStorage.getItem('notes')) || [],
            selectedId: localStorage.getItem('selected-id') || null,
        }
    },
    watch: {
        notes: {
            handler: 'saveNotes',
            deep: true,
        },
        selectedId(val) {
            localStorage.setItem('selected-id', val)
        },

    },
    computed: {
        notePreview() {
            return this.selectedNote ? marked(this.selectedNote.content) : '';
        },
        addButtonTitle() {
            return this.notes.length + ' note(s) already';
        },
        selectedNote() {
            return this.notes.find(note => note.id === this.selectedId)
        },
        sortedNotes() {
            return this.notes
                .sort((a, b) => a.created - b.created)
                .sort((a, b) => (a.favorite === b.favorite) ? 0
                    : a.favorite ? -1
                        : 1)
        }
    },
    methods: {
        addNote() {
            const time = Date.now();
            const note = {
                id: String(time),
                title: 'New note ' + (this.notes.length + 1),
                content: 'Write something here',
                created: time,
                favorite: false,
            };
            this.notes.push(note);
        },
        selectNote(note) {
            this.selectedId = note.id;
        },
        saveNotes() {
            localStorage.setItem('notes', JSON.stringify(this.notes));
            console.log('Notes saved!', new Date());
        },
        removeNote() {
            if (this.selectedNote && confirm('delete the note?')) {
                const index = this.notes.indexOf(this.selectedNote)
                if (index !== -1) {
                    this.notes.splice(index, 1);
                }
            }
        },
        favoriteNote() {
            this.selectedNote.favorite ^= true
        },
    }
})